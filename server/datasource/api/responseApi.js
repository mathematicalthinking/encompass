/**
  * # Response API
  * @description This is the API for response requests
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.3
  */

//REQUIRE MODULES
const logger   = require('log4js').getLogger('server');

//REQUIRE FILES
const utils    = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');
const models   = require('../schemas');
const wsAccess = require('../../middleware/access/workspaces');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @public
  * @method getResponse
  * @description __URL__: /api/responses/:id
  * @returns {Object} A 'named' response object
  * @throws {InternalError} Data retrieval failed
  */
function getResponse(req, res, next) {
  models.Response.findById(req.params.id)
    .exec(function(err, doc){
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      if (!doc || doc.isTrashed) {
        return utils.sendResponse(res, null);
      }

      var data = {'response': doc};
      utils.sendResponse(res, data);
    });
}

/**
  * @public
  * @method getResponses
  * @description __URL__: /api/responses
  * @see [buildCriteria](../../middleware/requestHandler.html)
  * @returns {Object} A 'named' array of response objects: according to specified criteria
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

function accessibleResponses(user) {
  return {
    $or: [
      { createdBy: user },
      { recipient: user },
    ],
    isTrashed: false
  };
}


function getResponses(req, res, next) {
  var user = userAuth.requireUser(req);
  var criteria = accessibleResponses(user);

  criteria.$or.push({ workspace: { $in: req.mf.auth.workspaces } });

  models.Response.find(criteria).exec(function(err, docs) {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }

    var data = {'response': docs};
    utils.sendResponse(res, data);
    next();
  });
}

/**
  * @public
  * @method postResponse
  * @description __URL__: /api/responses
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
  */
function postResponse(req, res, next) {

  var user = userAuth.requireUser(req);
  var workspaceId = req.body.response.workspace;
  models.Workspace.findById(workspaceId).lean().populate('owner').populate('editors').populate('createdBy').exec(function(err, ws){
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    if(wsAccess.canModify(user, ws, 'feedback')) {

      var response = new models.Response(req.body.response);
      response.createdBy = user;
      response.createDate = Date.now();

      response.save(function(err, doc) {
        if(err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }

        var data = {'response': doc};
        utils.sendResponse(res, data);
        next();
      });
    } else {
      logger.info("permission denied");
      res.send(403, "You don't have permission for this workspace");
    }
  });
}


function putResponse(req, res, next) {

  var user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Response.findById(req.params.id,
    function (err, doc) {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }

      //TODO permissions check

      for(var field in req.body.response) {
        if((field !== '_id') && (field !== undefined)) {
          doc[field] = req.body.response[field];
        }
      }

      doc.save(function (err, response) {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }
        var data = {'response': response};
        utils.sendResponse(res, data);
        next();
      });
    }
  );
}


module.exports.get.response   = getResponse;
module.exports.get.responses = getResponses;
module.exports.post.response  = postResponse;
module.exports.put.response   = putResponse;
