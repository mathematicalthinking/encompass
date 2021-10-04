/**
  * @description This is the API for tagging based requests
  * @author Damola Mabogunje, Daniel Kelly
  * @since 1.0.0
  */
//REQUIRE MODULES
const logger   = require('log4js').getLogger('server');
//REQUIRE FILES
const utils    = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');
const models   = require('../schemas');
const wsAccess = require('../../middleware/access/workspaces');
const access   = require('../../middleware/access/taggings');

const { areObjectIdsEqual } = require('../../utils/mongoose');

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
async function getTaggings(req, res, next) {
  const user = userAuth.requireUser(req);
  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }
  let ids = req.query.ids;
  let criteria;
  try {
    criteria = await access.get.taggings(user, ids);

  }catch(err) {
    console.error(`Error building selections criteria: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }

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
async function getTagging(req, res, next) {
  try {
    const user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.InvalidCredentialsError('You must be logged in.', res);
    }

    let id = req.params.id;

    let tagging = await models.Tagging.findById(id);

    if (!tagging || tagging.isTrashed) { // record not found in db
      return utils.sendResponse(res, null);
    }

    let canLoadTagging = await access.get.tagging(user, id);

    if (!canLoadTagging) { // user does not have permission to access tagging
      return utils.sendError.NotAuthorizedError('You do not have permission.', res);
    }

    const data = { // user has permission; send back record
      tagging
    };

    return utils.sendResponse(res, data);
  }catch(err) {
    console.error(`Error getTagging: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }
}

/**
  * @public
  * @method postTagging
  * @description __URL__: /api/taggings
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
async function postTagging(req, res, next) {
  try {
    let user = userAuth.requireUser(req);
    let workspaceId = req.body.tagging.workspace;

    let workspace = await models.Workspace.findById(workspaceId).lean().populate('owner').populate('editors').populate('createdBy').exec();

    let canCreateTaggingInWs = wsAccess.canModify(user, workspace, 'selections', 2);

    if (!canCreateTaggingInWs) {
      logger.info("permission denied");
      return utils.sendError.NotAuthorizedError( `You don't have permission for this workspace`, res);
    }

    let tagging = new models.Tagging(req.body.tagging);
    tagging.createdBy = user;
    tagging.lastModifiedBy = user;
    tagging.createDate = Date.now();
    tagging.lastModifiedDate = Date.now();

    await tagging.save();

    let data = { tagging };
    utils.sendResponse(res, data);

  }catch(err) {
    logger.error(err);
    return utils.sendError.InternalError(err, res);

  }
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
  models.Workspace.findById(workspaceId).lean().populate('owner').populate('editors').populate('createdBy').exec(function(err, ws){
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // if can modify selections can modify taggings
    if(areObjectIdsEqual(user.id, req.body.tagging.createdBy) || wsAccess.canModify(user, ws, 'selections', 3)) {
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
          doc.lastModifiedBy = user._id;
          doc.lastModifiedDate = Date.now();

          doc.save(function (err, tagging) {
            if(err) {
              logger.error(err);
              return utils.sendError.InternalError(err, res);
            }

            var data = {'tagging': tagging};
            utils.sendResponse(res, data);
          });
        });
    } else {
      logger.info("permission denied");
      return utils.sendError.NotAuthorizedError(`You don't have permission for this workspace`, res);
    }
  });
}

module.exports.get.taggings = getTaggings;
module.exports.get.tagging = getTagging;
module.exports.post.tagging = postTagging;
module.exports.put.tagging = putTagging;
