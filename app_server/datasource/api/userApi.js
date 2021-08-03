/* jshint ignore:start */
/**
  * @description This is the API for user based requests
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */

//REQUIRE MODULES
const logger   = require('log4js').getLogger('server');
const _        = require('underscore');

//REQUIRE FILES
const models   = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils    = require('../../middleware/requestHandler');
const access   = require('../../middleware/access/users');
const auth = require('../../datasource/api/auth');
const sso = require('../../services/sso');

const objectUtils = require('../../utils/objects');
const { isNonEmptyObject } = objectUtils;

const { areObjectIdsEqual } = require('../../utils/mongoose');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @private
  * @method makeGuest
  * @returns {Object} The default guest user
  */
function makeGuest() {
  return {_id: 1, username: 'anon', name: 'Guest', isGuest: true};
}

/**
  * @public
  * @method sendUsers
  * @description __URL__: /api/users
  * @returns {Object} A 'named' array of all user objects
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong

           The front-end should be sending ?alias=current and we should respond with a guest user
           if they aren't logged in. The front-end requires an _id field always, so the guest is
           user._id=1. This could easily be changed to return all users currently logged in with
           the current user having a flag: isMe=true then the client would filter currentUser for isMe
           and do whatever they want with the rest of the users
*/
async function sendUsers(req, res, next) {
  try {
    const user = userAuth.getUser(req);

    if(!user) {
    // they aren't authorized just send them a list of the guest user back
    utils.sendResponse(res, {user: makeGuest()});
    return next();
    }

    if (req.query.alias === 'current') {
      // if all they wanted was the current user, fine
      return utils.sendResponse(res, { user });
    }

    let criteria;

    if (req.query.usernameSearch) {
      var username = req.query.usernameSearch;
      let filterBy = req.query.filterBy;
      var regex;
      // we currently allow emails as usernames so had to fix this to just replace whitespace
      username = username.replace(/\s+/g, "");

      let exactRegex = new RegExp(`^${username}$`, 'i');

      regex = new RegExp(username, 'i');

      criteria = await access.get.users(user, null, null, regex, filterBy, exactRegex);

    } else if (req.query.username) {
      criteria = await access.get.users(user, null, req.query.username);
    } else if (req.query.ids) {
      criteria = await access.get.users(user, req.query.ids, null);
    } else if (req.query.isTrashed) {
      criteria = { isTrashed: true };
    } else {
      criteria = await access.get.users(user, null, null);
    }

    const requestedUsers = await models.User.find(criteria).lean().exec();
    //TODO filter what is being sent back from user

      requestedUsers.forEach((user) => {
        delete user.password;
        delete user.key;
        delete user.history;
      });

    let data = {'user': requestedUsers};
    return utils.sendResponse(res, data);

  }catch(err) {
    console.error(`Error sendUsers: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }

}

/**
  * @public
  * @method sendUser
  * @description __URL__: /api/users/:id
  * @see [buildCriteria](.../../middleware/requestHandler.html)
  * @returns {Object} A 'named' user object: according to specified request criteria
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
async function sendUser(req, res, next) {
  try {
    var user = userAuth.requireUser(req);
    if (!user) {
      return utils.sendError.InvalidCredentialsError('No user logged in!', res);
    }

    // userPermissions is an object with doesExist, hasPermission, and requestedUser
    const userPermissions = await access.get.user(user, req.params.id, null);

    // Id or username was not provided
    if (userPermissions === undefined) {
      return utils.sendError.InternalError(null, res);
    }

    const { doesExist, hasPermission, requestedUser } = userPermissions;

    // Record does not exist
    if (!doesExist) {
      return utils.sendResponse(res, null);
    }

    // Record exists but user does not have permission
    if (!hasPermission) {
      return utils.sendError.NotAuthorizedError('You do not have permission to access this user.', res);
    }

    // User exists and has permission
    if (hasPermission && requestedUser) {
      var data = {'user': requestedUser};

      delete data.user.key; //hide key
      delete data.user.history; // hide history
      // delete data.user.password;
      if (user.accountType === 'S') {
        delete data.user.createdBy;
      }

      return utils.sendResponse(res, data);
    }
  }catch(err) {
    console.error(`Error sendUser: ${err}`);
    console.trace();
    return utils.sendError.InternalError(err, res);
  }
}

/**
  * @public
  * @method postUser
  * @description __URL__: /api/users
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data save failed
  * @throws {InvalidContentError} User already exists
  * @throws {RestError} Something? went wrong
  */
function postUser(req, res, next) {

  var user = userAuth.requireUser(req);
  if (!user.isAdmin) {
    return utils.sendError.NotAuthorizedError('You do not have permissions to do this', res);
    //return next(false);
  }

  var newUser = new models.User(req.body.user);

  models.User.findOne({username: newUser.username}, function(err, found){
    if (err || !found) {
      newUser.save(function(err, saved) {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }
        var data = {'user': saved};
        utils.sendResponse(res, data);
      });
    } else {
      return utils.sendError.InvalidContentError(`User: ${newUser.username} already exists!`, res);
    }
  });
}

/**
  * @public
  * @method putUser
  * @description __URL__: /api/users/:id
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data save failed
  * @throws {RestError} Something? went wrong
  */
  async function putUser(req, res, next) {
    try {
      const requestBody = req.body.user;
      if (!isNonEmptyObject(requestBody)) {
        return utils.sendError.InvalidContentError(null, res);
      }
       /* These fields are uneditable */
    delete requestBody.username;
    delete requestBody.createDate;
    delete requestBody.key;
    delete requestBody.password;

    //TODO: Filter so teachers can only modify students they created (or in any of their sections?)
    const user = userAuth.requireUser(req);

    let isSelf = areObjectIdsEqual(user._id, req.params.id);

    let canModifyUser = await access.canModifyUser(user, req.params.id);
    if (!canModifyUser) {
      return utils.sendError.NotAuthorizedError('You do not have permissions modify this user.', res);
    }

    let shouldSendAuthEmail = requestBody.shouldSendAuthEmail;
    let doConfirmEmail;

    let updateHash = {};

    // Should we handle a nonexisting userid separately?
    if (user.accountType === 'S') {
      shouldSendAuthEmail = false;
      if (!_.isUndefined(requestBody.seenTour)) {
        updateHash.seenTour = requestBody.seenTour;
      }
    }
    else if (user.actingRole === 'student') {
      shouldSendAuthEmail = false;
      if (!_.isUndefined(requestBody.seenTour)) {
        updateHash.seenTour = requestBody.seenTour;
      }
      if (_.contains(['teacher', 'student'], requestBody.actingRole)) {
        updateHash.actingRole = requestBody.actingRole;
      }
    } else {
      // only account Types T, P, A in acting role teacher
      // do we need to explicitly verify that account type is within T,P,A?
      if (requestBody.accountType === 'A' || requestBody.accountType === 'P') {
        if (user.accountType !== 'A') {
          // only Admins can change accounts to admin or pdadmin
          // should we send error?
          delete requestBody.accountType;
        }
      }
      doConfirmEmail = requestBody.isConfirmingEmail;

      delete requestBody.isConfirmingEmail;

      updateHash = requestBody;
    }
    updateHash.socketId = requestBody.socketId;

    if (isSelf) {
      if (Array.isArray(requestBody.notifications)) {
        updateHash.notifications = requestBody.notifications;
      }
    }

    const updatedUser = await models.User.findByIdAndUpdate(req.params.id, updateHash, {new: true}).exec();

    let confirmEmailResults;
    let ssoConfirmedUser;


    if (doConfirmEmail) {
      try {
        confirmEmailResults = await sso.confirmEmailById(updatedUser.ssoId, user);

        ssoConfirmedUser = confirmEmailResults.user;
      }catch(err) {
        console.log('sso confirm email error', err);
        // need to notify user that confirm email may have failed?
        // but what if other updates were successfull?
      }
    }


    const data = { user: ssoConfirmedUser ? ssoConfirmedUser : updatedUser };
    // if shouldSendAuthEmail send email to user confirming that they have been authorized
    if (shouldSendAuthEmail) {
      let recipient = updatedUser.email;
      if (recipient) {
          // send email but do not wait for success to return user response
        auth.sendEmailSMTP(recipient, req.headers.host, 'newlyAuthorized', null, updatedUser);

        }
      }
      return utils.sendResponse(res, data);
    }catch(err) {
      console.error(`Error userApi putUser: ${err}`);
      console.trace();
      return utils.sendError.InternalError(err, res);
    }

  }
  /**
    * @public
    * @method addSection
    * @description __URL__: /api/users/addSection/:id
    * @throws {NotAuthorizedError} User has inadequate permissions
    * @throws {InternalError} Data save failed
    * @throws {RestError} Something? went wrong
  */

  const addSection = (req, res, next) => {
    var user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.InvalidCredentialsError('No user logged in!', res);
    }
    // who can add a section for a user. If they're a teacher they should
    // be able to add a section to themselves. If they're a student
    models.User.findByIdAndUpdate(
      req.params.id,
      {$push: {sections: req.body.section}},
      {new: true} // specifying that we want the UPDATED version returned
    ).exec((err, doc) => {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'user': doc};
      utils.sendResponse(res, data);
    });
  };

  /**
    * @public
    * @method removeSection
    * @description __URL__: /api/users/removeSection/:id
    * @body {sectionId: ObjectId}
    * @throws {NotAuthorizedError} User has inadequate permissions
    * @throws {InternalError} Data update failed
    * @throws {RestError} Something? went wrong
  */
  const removeSection = (req, res, next) => {
    const user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.InvalidCredentialsError('No user logged in!', res);
    }

    models.User.findByIdAndUpdate(
      req.params.id,
      {"$pull": {"sections": {"sectionId": req.body.sectionId}}},
      {new: true}
    ).exec((err, doc) => {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'user': doc};
      utils.sendResponse(res, data);
    });
  };

  const addAssignment = (req, res, next) => {
    const user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.InvalidCredentialsError('No user logged in!', res);
    }

    models.User.findByIdAndUpdate(
      req.params.id,
      {"$push": {"assignments": req.body.assignment}},
      {new: true}
    ).exec((err, doc) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'user': doc};
      utils.sendResponse(res, data);
    });
  };

  const removeAssignment = (req, res, next) => {
    const user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.InvalidCredentialsError('No user logged in!', res);
    }

    models.User.findByIdAndUpdate(
      req.params.id,
      {"$pull": {"assignments": req.body.assignment}},
      {new: true}
    ).exec((err, doc) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'user': doc};
      utils.sendResponse(res, data);
    });
  };

  module.exports.get.user = sendUser;
  module.exports.get.users = sendUsers;
  module.exports.post.user = postUser;
  module.exports.put.user = putUser;
  module.exports.put.user.addSection = addSection;
  module.exports.put.user.removeSection = removeSection;
  module.exports.put.user.addAssignment = addAssignment;
  module.exports.put.user.removeAssignment = removeAssignment;
/* jshint ignore:end */