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
const access = require('../../middleware/access/responses');

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
  let user = userAuth.requireUser(req);

    return models.Response.findById(req.params.id).lean().exec()
      .then((response) => {
        if (!response || response.isTrashed) {
          return utils.sendResponse(res, null);
        }

        return access.get.response(user, req.params.id)
          .then((canGet) => {
            if (!canGet) {
              return utils.sendError.NotAuthorizedError('You do not have permission to access this response.', res);
            }

        // only approvers should see the note field
        // for now just dont send back to students
        if (user.accountType === 'S' || user.actingRole === 'student') {
          delete response.note;
        }
        return utils.sendResponse(res, {response});
      });
  })
  .catch((err) => {
    console.error(`Error getResponse: ${err}`);
    return utils.sendError.InternalError(null, res);
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

function getResponses(req, res, next) {
  let user = userAuth.requireUser(req);

  let { ids, workspace, filterBy, isAdminActingPd } = req.query;
  return access.get.responses(user, ids, workspace, filterBy, isAdminActingPd)
  .then((criteria) => {
    models.Response.find(criteria).lean().exec()
      .then((responses) => {

        let data = {'response': responses};

        return utils.sendResponse(res, data );
      });
  })
  .catch((err) => {
    console.error(`Error get Responses: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
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
