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
const accessUtils = require('../../middleware/access/utils');

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
  var user = userAuth.getUser(req);
  if(!user) {
    // they aren't authorized just send them a list of the guest user back
    utils.sendResponse(res, {user: [makeGuest()]});
    return next();
  }

  if(req.query.alias === 'current') {
    // if all they wanted was the current user, fine
    return utils.sendResponse(res, {user: [user]});

  }

  var criteria;

  if (req.query.username) {
    var username = req.query.username;
    var regex;
    // we currently allow emails as usernames so had to fix this to just replace whitespace
    username = username.replace(/\s+/g, "");
    regex = new RegExp(username, 'i');

    criteria = await access.get.users(user, null, null, regex);
    const requestedUsers = await models.User.find(criteria).lean().exec();
    // either empty array or array of one user
    //const accessibleUserIds = await accessUtils.getModelIds('User', criteria);

    // if requestedUser exists but don't have permission
    // if (requestedUser && !_.isEqual(accessibleUserIds[0], requestedUser._id)) {
    //   return utils.sendError.NotAuthorizedError(null, res);
    // }
    let data;
    requestedUsers.forEach((user) => {
      delete user.key;
      // delete user.password;
      delete user.history;
    });
        data = {'user': requestedUsers};
      return utils.sendResponse(res, data);

  } else if (req.query.ids) {
    criteria = await access.get.users(user, req.query.ids, null);
  } else {
    criteria = await access.get.users(user, null, null);
  }

  models.User.find(criteria)
    .lean()
    .exec(function(err, docs) {
      if (err) {
        return utils.sendError.InternalError(err, res);
      }

      docs.forEach(function(doc){
        delete doc.key; //don't send the users keys out
        delete doc.history; //don't send user history out
        // delete doc.password;
      });
      var data = {'user': docs};
      return utils.sendResponse(res, data);
      //next();
    });
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
  console.log('params.id', req.params.id);
  try {
    var user = userAuth.getUser(req);

    if (!user) {
      return utils.sendError.NotAuthorizedError(null, res);
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
      return utils.sendError.NotAuthorizedError(null, res);
    }

    // User exists and has permission
    if (hasPermission && requestedUser) {
      var data = {'user': requestedUser};

      delete data.user.key; //hide key
      delete data.user.history; // hide history
      // delete data.user.password;

      return utils.sendResponse(res, data);
    }
  }catch(err) {
    console.log('error sendUser', err);
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
    /* These fields are uneditable */
    delete req.body.user.username;
    delete req.body.user.createDate;
    delete req.body.user.key;

    //TODO: Filter so teachers can only modify students they created (or in any of their sections?)
    var user = userAuth.requireUser(req);
    var modifiableUserCriteria = access.put.user(user);
    var modifiableUsers = await models.User.find(modifiableUserCriteria, {_id: 1}).lean().exec();
    var userIds = modifiableUsers.map(obj => obj._id.toString());

    // Should we handle a nonexisting userid separately?
    if (user.accountType === 'S' || !_.contains(userIds, req.params.id)) {
      return utils.sendError.NotAuthorizedError('You do not have permissions to do this', res);
    }
    if (user.actingRole === 'student') {
      models.User.findByIdAndUpdate(
        req.params.id,
        /* actingRole students can only update their actingRole */
        { actingRole: req.body.user.actingRole },
        { new: true }
      ).exec((err, doc) => {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }
        var data = {'user': doc};
        return utils.sendResponse(res, data);
      });
    } else if (user.accountType === 'A' || user.accountType === 'T' || user.accountType === 'P') {
      models.User.findByIdAndUpdate(
        req.params.id,
        req.body.user,
        { new: true }
      ).exec((err, doc) => {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }
        var data = {'user': doc};
        return utils.sendResponse(res, data);
      });
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
    const user= userAuth.requireUser(req);
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