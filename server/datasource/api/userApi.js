/**
  * @description This is the API for user based requests
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */
var mongoose = require('mongoose'),
    cookie   = require('cookie'),
    express  = require('express'),
    logger   = require('log4js').getLogger('server'),
    models   = require('../schemas'),
    userAuth = require('../../middleware/userAuth'),
    utils    = require('../../middleware/requestHandler');

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

  if(!user) {
    // they aren't authorized just send them a list of the guest user back
    utils.sendResponse(res, {user: [makeGuest()]});
    return next();
  }

  if(req.query.alias === 'current') {
    // if all they wanted was the current user, fine
    utils.sendResponse(res, {user: [user]});
    return next();
  }

  var criteria = utils.buildCriteria(req);
  if(req.query.name) { //if we're doing a search GET /users/?name=xyz
    var name = req.query.name;
    name = name.replace(/\W+/g, "");
    var regex = new RegExp(name, 'i');
    criteria.$or = [{username: regex}, {name: regex}];
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
  console.log('SENDING USER');
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
        console.log('DATAL ', data);
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

    /* These fields are uneditable */
    delete req.body.user.username;
    delete req.body.user.createDate;
    delete req.body.user.key;

<<<<<<< HEAD
  var user = userAuth.requireUser(req);
  if (user.isAdmin) {
    models.User.findByIdAndUpdate(req.params.id,
      /* Admins can update all editable fields for any user */
      req.body.user,
      function (err, doc) {
=======
    var user = auth.requireUser(req);
    if (user.isAdmin) {
      models.User.findByIdAndUpdate(
        req.params.id,
        req.body.user,
        {new: true},
      ).exec((err, doc) => {
>>>>>>> Add user put tests
        if (err) {
          logger.error(err);
          utils.sendError.InternalError(err, res);
        }
        var data = {'user': doc};
        utils.sendResponse(res, data);
      });
    } else {
      /* non-admins can only update themselves */
      if (req.params.id !== user.id) {
        utils.sendError.NotAuthorizedError('You do not have permissions to do this', res);
        return;
      }
      models.User.findByIdAndUpdate(
        req.params.id,
        /* non-admins can only update their names, and seenTour fields */
        {name: req.body.user.name, seenTour: req.body.user.seenTour}
      ).exec((err, doc) => {
        if (err) {
          logger.error(err);
          utils.sendError.InternalError(err, res);
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
    var user = auth.requireUser(req);
    // who can add a section for a user. If they're a teacher they should
    // be able to add a section to themselves. If they're a student
    models.User.findByIdAndUpdate(
      req.params.id,
      {$push: {sections: req.body}},
      {new: true} // specifying that we want the UPDATED version return
    ).lean().exec((err, doc) => {
      if(err) {
        console.log("ERROR: ", err)
        logger.error(err);
        utils.sendError.InternalError(err, res);
        return;
      }
      const data = {'user': doc};
      console.log("DATA: ", data);
      utils.sendResponse(res, data);
    });
  };

  /**
    * @public
    * @method removeProblem
    * @description __URL__: /api/sections/removeProblem:id
    * @body {problemId: ObjectId}
    * @throws {NotAuthorizedError} User has inadequate permissions
    * @throws {InternalError} Data update failed
    * @throws {RestError} Something? went wrong
  */
  const removeSection = (req, res, next) => {
    const user = auth.requireUser(req);
    models.User.findByIdAndUpdate(
      req.params.id,
      {"$pull": {"sections": {"sectionId": req.body.section.sectionId}}}
    ).exec((err, doc) => {
      if(err) {
        logger.error(err);
        utils.sendError.InternalError(err, res);
        return;
      }
      const data = {'user': doc};
      utils.sendResponse(res, data);
    });
  };

  const addAssignment = (req, res, next) => {
    const user= auth.requireUser(req);
    models.User.findByIdAndUpdate(
      req.params.id,
      {"$push": {"assignments": req.body.assignment}}
    ).exec((err, doc) => {
      if (err) {
        logger.error(err);
        utils.sendError.InternalError(err, res);
        return;
      }
      const data = {'user': doc};
      console.log("DATA: ",data);
      utils.sendResponse(res, data);
    });
  };

  const removeAssignment = (req, res, next) => {
    const user = auth.requireUser(req);
    models.User.findByIdAndUpdate(
      req.params.id,
      {"$pull": {"assignments": {"problemId": req.body.assignment.problemId}}}
    ).exec((err, doc) => {
      if (err) {
        logger.error(err);
        utils.sendError.InternalError(err, res);
        return;
      }
      const data = {'user': doc};
      console.log("DATA@: ", data);
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
