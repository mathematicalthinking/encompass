/**
  * # Selections API
  * @description This is the API for selection based requests
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
  * @method getSelections
  * @description __URL__: /api/selections
  * @see [buildCriteria](../../middleware/requestHandler.html)
  * @returns {Object} A 'named' array of selection objects: according to specified criteria
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
function getSelections(req, res, next) {
  var criteria = utils.buildCriteria(req);

  var user = userAuth.requireUser(req);
  models.Selection.find(criteria)
    .exec(function(err, selections) {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }

      console.log(selections.length);
      var data = {'selection': selections};
      utils.sendResponse(res, data);
      next();
    });
}

/**
  * @public
  * @method getSelection
  * @description __URL__: /api/selections/:id
  * @returns {Object} A 'named' selection object
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
function getSelection(req, res, next) {

  var user = userAuth.requireUser(req);
  models.Selection.findById(req.params.id)
    .exec(function(err, selection) {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }

      var data = {'selection': selection};
      utils.sendResponse(res, data);
      next();
    });
}

/**
  * @public
  * @method postSelection
  * @description __URL__: /api/selections
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
function postSelection(req, res, next) {

  var user = userAuth.requireUser(req);
  var workspaceId = req.body.selection.workspace;

  models.Workspace.findById(workspaceId).lean().populate('owner').populate('editors').exec(function(err, ws){
    if(permissions.userCan(user, ws, "SELECTIONS")) {
      var selection = new models.Selection(req.body.selection);
      selection.createdBy = user;
      selection.createDate = Date.now();

      selection.save(function(err, doc) {
        if(err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }

        var data = {'selection': doc};
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
  * @method postSelection
  * @description __URL__: /api/selections
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
function putSelection(req, res, next) {

  logger.warn("Putting Selection 1");
  var user = userAuth.requireUser(req);
  models.Selection.findById(req.params.id, function (err, doc) {
    logger.warn("Putting Selection 2");
    if(err) {
      logger.warn("Putting Selection 3");
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }

      logger.warn("Putting Selection 4");
    for(var field in req.body.selection) {
      if((field !== '_id') && (field !== undefined)) {
        doc[field] = req.body.selection[field];
      }
    }
      logger.warn("Putting Selection 5 doc: " + JSON.stringify(doc) );

    doc.save(function (err, selection) {
      logger.warn("Tried to save selectoin!");
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }

      var data = {'selection': selection};
      utils.sendResponse(res, data);
      next();
    });
  });
}

module.exports.get.selections = getSelections;
module.exports.get.selection = getSelection;
module.exports.post.selection = postSelection;
module.exports.put.selection = putSelection;
