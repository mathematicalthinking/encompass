/**
  * # Selections API
  * @description This is the API for selection based requests
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */

//REQUIRE MODULES
const logger   = require('log4js').getLogger('server');

//REQUIRE FILES
const utils    = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');
const models   = require('../schemas');
const wsAccess   = require('../../middleware/access/workspaces');
const access = require('../../middleware/access/selections');


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
async function getSelections(req, res, next) {
  var user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }
  let ids = req.query.ids;
  let criteria;
  try {
    criteria = await access.get.selections(user, ids);

  }catch(err) {
    console.error(`Error building selections criteria: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }


  models.Selection.find(criteria)
    .exec(function(err, selections) {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      var data = {'selections': selections};
      utils.sendResponse(res, data);
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
async function getSelection(req, res, next) {
  try {
    const user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.InvalidCredentialsError('You must be logged in.', res);
    }

    let id = req.params.id;

    let selection = await models.Selection.findById(id);

    if (!selection || selection.isTrashed) { // record not found in db
      return utils.sendResponse(res, null);
    }

    let canLoadSelection = await access.get.selection(user, id);

    if (!canLoadSelection) { // user does not have permission to access selection
      return utils.sendError.NotAuthorizedError('You do not have permission.', res);
    }

    const data = { // user has permission; send back record
      selection
    };

    return utils.sendResponse(res, data);
  }catch(err) {
    console.error(`Error getSelection: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }
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

  models.Workspace.findById(workspaceId).lean().populate('owner').populate('editors').populate('createdBy').exec(function(err, ws){
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    if (wsAccess.canModify(user, ws, 'selections', 2)) {
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

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

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
      logger.warn("Tried to save selection!");
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }

      var data = {'selection': selection};
      utils.sendResponse(res, data);
    });
  });
}

module.exports.get.selections = getSelections;
module.exports.get.selection = getSelection;
module.exports.post.selection = postSelection;
module.exports.put.selection = putSelection;
