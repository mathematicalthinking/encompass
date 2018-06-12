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
    auth     = require('./auth'),
    utils    = require('./requestHandler');

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
  var user = auth.getUser(req);

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
      utils.sendResponse(res, data);
      next();
    });
}

/**
  * @public
  * @method sendUser
  * @description __URL__: /api/users/:id
  * @see [buildCriteria](../requestHandler.html)
  * @returns {Object} A 'named' user object: according to specified request criteria
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
function sendUser(req, res, next) {
  console.log('id',req.params.id);
  var user = auth.getUser(req);
  models.User.findById(req.params.id)
    .lean()
    .exec(function(err, doc) {
      if (err) {
        console.log('in err block: ', err);
        return utils.sendError.InternalError(err, res);
      }
      console.log('after err if block', doc);
      var data = {'user': doc};
      delete data.user.key; //hide key
      delete data.user.history; // hide history
      utils.sendResponse(res, data);
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

  var user = auth.requireUser(req);
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
        next();
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

  var user = auth.requireUser(req);
  if (user.isAdmin) {
    models.User.findByIdAndUpdate(req.params.id,
      /* Admins can update all editable fields for any user */
      req.body.user,
      function (err, doc) {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }
        console.log('after err, ', doc);
        var data = {'user': doc};
        utils.sendResponse(res, data);
      });
  } else {
    /* non-admins can only update themselves */
    if (req.params.id !== user.id) {
      return utils.sendError.NotAuthorizedError('You do not have permissions to do this', res);
    }

    models.User.findByIdAndUpdate(req.params.id,
      /* non-admins can only update their names, and seenTour fields */
      { name: req.body.user.name,
        seenTour: req.body.user.seenTour
      },
      function (err, doc) {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }

        var data = {'user': doc};
        utils.sendResponse(res, data);
      });
  }
}

module.exports.get.user = sendUser;
module.exports.get.users = sendUsers;
module.exports.post.user = postUser;
module.exports.put.user = putUser;
