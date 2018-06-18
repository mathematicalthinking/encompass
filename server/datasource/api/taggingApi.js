/**
  * @description This is the API for tagging based requests
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */
var mongoose = require('mongoose'),
    express  = require('express'),
    logger   = require('log4js').getLogger('server'),
    utils    = require('../../middleware/requestHandler'),
    auth     = require('./auth'),
    userAuth = require('../../middleware/userAuth'),
    permissions  = require('../../../common/permissions'),
    models   = require('../schemas');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};


/**
  * @public
  * @method getTaggings
  * @description __URL__: /api/taggings
  * @see [buildCriteria](.../../middleware/requestHandler.html)
  * @returns {Object} A 'named' array of tagging objects: according to specified request criteria
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
function getTaggings(req, res, next) {
  var criteria = utils.buildCriteria(req);

  models.Tagging.find(criteria)
    .exec(function(err, tags) {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }

      var data = {'taggings': tags};
      utils.sendResponse(res, data);
      next();
    });
}

/**
  * @public
  * @method getTagging
  * @description __URL__: /api/taggings/:id
  * @returns {Object} A 'named' tagging object
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
function getTagging(req, res, next) {
  models.Tagging.findById(req.params.id)
    .exec(function(err, tags) {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }

      var data = {'tagging': tags};
      utils.sendResponse(res, data);
      next();
    });
}

/**
  * @public
  * @method postTagging
  * @description __URL__: /api/taggings
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
function postTagging(req, res, next) {

  var user = userAuth.requireUser(req);
  var workspaceId = req.body.tagging.workspace;
  models.Workspace.findById(workspaceId).lean().populate('owner').populate('editors').exec(function(err, ws){
    if(permissions.userCan(user, ws, "SELECTIONS")) {

      var tagging = new models.Tagging(req.body.tagging);
      tagging.createdBy = user;
      tagging.createDate = Date.now();

      tagging.save(function(err, doc) {
        if(err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }

        var data = {'tagging': doc};
        utils.sendResponse(res, data);
        next();
      });
    } else {
      logger.info("permission denied");
      res.send(403, "You don't have permission for this workspace");
    }
  });

}

/**
  * @public
  * @method putTagging
  * @description __URL__: /api/taggings
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
function putTagging(req, res, next) {

  var user = userAuth.requireUser(req);
  var workspaceId = req.body.tagging.workspace;
  models.Workspace.findById(workspaceId).lean().populate('owner').populate('editors').exec(function(err, ws){
    if(permissions.userCan(user, ws, "SELECTIONS")) {
      models.Tagging.findById(req.params.id,
        function (err, doc) {
          if(err) {
            logger.error(err);
            return utils.sendError.InternalError(err, res);
          }

          for(var field in req.body.tagging) {
            if((field !== '_id') && (field !== undefined)) {
              doc[field] = req.body.tagging[field];
            }
          }

          doc.save(function (err, tagging) {
            if(err) {
              logger.error(err);
              return utils.sendError.InternalError(err, res);
            }

            var data = {'tagging': tagging};
            utils.sendResponse(res, data);
            next();
          });
        });
    } else {
      logger.info("permission denied");
      res.send(403, "You don't have permission for this workspace");
    }
  });
}

module.exports.get.taggings = getTaggings;
module.exports.get.tagging = getTagging;
module.exports.post.tagging = postTagging;
module.exports.put.tagging = putTagging;
