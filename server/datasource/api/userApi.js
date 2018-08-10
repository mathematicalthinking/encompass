/**
  * @description This is the API for user based requests
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */

//REQUIRE MODULES
const logger   = require('log4js').getLogger('server');

//REQUIRE FILES
const models   = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils    = require('../../middleware/requestHandler');

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
function sendUsers(req, res, next) {
  var user = userAuth.getUser(req);
  console.log('user', user);
  if(!user) {
    // they aren't authorized just send them a list of the guest user back
    utils.sendResponse(res, {user: [makeGuest()]});
    return next();
  }

  if(req.query.alias === 'current') {
    // if all they wanted was the current user, fine
    return utils.sendResponse(res, {user: [user]});
    //return next();
  }
  var criteria = utils.buildCriteria(req);

  if(req.query.name) { //if we're doing a search GET /users/?name=xyz
    var name = req.query.name;
    var username = name.username;
    var regex;
    if (username) {
      username = username.replace(/\W+/g, "");
      regex = new RegExp(username, 'i');
      criteria = {
        username: regex,
        isTrashed: false
      };
    } else {
      name = name.replace(/\W+/g, "");
      regex = new RegExp(name, 'i');
      criteria = {
        name: regex,
        isTrashed: false
      };
    }
  } else if (req.query.ids) { //if we're doing a search GET /users/?ids=
    const ids = req.query.ids;
    criteria = {
      _id: {$in: ids},
      isTrashed: false
    };
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
function sendUser(req, res, next) {
  var user = userAuth.getUser(req);
  models.User.findById(req.params.id)
    .lean()
    .exec(function(err, doc) {
      if (err) {
        return utils.sendError.InternalError(err, res);
      }
      var data = {'user': doc};
      delete data.user.key; //hide key
      delete data.user.history; // hide history
      return utils.sendResponse(res, data);
      //next();
    });
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
  function putUser(req, res, next) {
    console.log('req.body in put user', req.body);
    /* These fields are uneditable */
    delete req.body.user.username;
    delete req.body.user.createDate;
    delete req.body.user.key;

    //TODO: Filter so teachers can only modify students they created (or in any of their sections?)
    var user = userAuth.requireUser(req);
    if (user.isAdmin || req.body.user.isStudent) {
      models.User.findByIdAndUpdate(
        req.params.id,
        req.body.user,
        {new: true}
      ).exec((err, doc) => {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }
        var data = {'user': doc};
        utils.sendResponse(res, data);
      });
    } else {
      /* non-admins can only update themselves */
      if (req.params.id !== user.id) {
        return utils.sendError.NotAuthorizedError('You do not have permissions to do this', res);
      }
      models.User.findByIdAndUpdate(
        req.params.id,
        /* non-admins can only update their names, and seenTour fields */
        {name: req.body.user.name, seenTour: req.body.user.seenTour}
      ).exec((err, doc) => {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }
        var data = {'user': doc};
        utils.sendResponse(res, data);
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
