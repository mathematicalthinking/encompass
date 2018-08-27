/**
  * # Folder API
  * @description This is the API for folder based requests
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */

//REQUIRE MODULES
const logger   = require('log4js').getLogger('server');

//REQUIRE FILES
const utils    = require('../../middleware/requestHandler');
const auth     = require('./auth');
const userAuth = require('../../middleware/userAuth');
const permissions  = require('../../../common/permissions');
const data     = require('./data');
const models   = require('../schemas');
const wsAccess   = require('../../middleware/access/workspaces');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @public
  * @method getFolder
  * @description __URL__: /api/folders/:id
  * @returns {Object} A 'named' folder object
  * @throws {InternalError} Data retrieval failed
  */
function getFolder(req, res, next) {
  models.Folder.findById(req.params.id)
    .exec(function(err, doc){
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }

      var data = {'folder': doc};
      utils.sendResponse(res, data);
    });
}

/**
  * @public
  * @method getFolderSets
  * @description __URL__: /api/folderSets
  * @returns {Object} A 'named' hardcoded list *for now*
  */
function getFolderSets(req, res, next) {
  res.send({folderSet: data.folderSets});
}

/**
  * @public
  * @method getFolders
  * @description __URL__: /api/folders
  * @see [buildCriteria](../../middleware/requestHandler.html)
  * @returns {Object} A 'named' array of folder objects: according to specified criteria
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
function getFolders(req, res, next) {
  var criteria = utils.buildCriteria(req);

  models.Folder.find(criteria).exec(function(err, docs) {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }

    var data = {'folders': docs};
    utils.sendResponse(res, data);
  });
}

/**
  * @public
  * @method postFolder
  * @description __URL__: /api/folders
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
  */
function postFolder(req, res, next) {
  var user = userAuth.requireUser(req);
  var workspaceId = req.body.folder.workspace;
  models.Workspace.findById(workspaceId).lean().populate('owner').populate('editors').exec(function(err, ws){
    if(wsAccess.canModify(user, ws)) {
      var folder = new models.Folder(req.body.folder);
      folder.createdBy = user;
      folder.createDate = Date.now();
      folder.save(function(err, doc) {
        if(err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }

        var data = {'folder': doc};
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
  * @method putFolder
  * @description __URL__: /api/folders/:id
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
  */
function putFolder(req, res, next) {

  var user = userAuth.requireUser(req);
  models.Workspace.findOne({owner: user._id, folders: req.params.id}).lean().populate('owner').populate('editors').exec(function(err, ws){
    logger.warn("PUTTING FOLDER: " + JSON.stringify(req.body.folder) );
    if(wsAccess.canModify(user, ws)) {
      models.Folder.findById(req.params.id,
        function (err, doc) {
          if(err) {
            logger.error(err);
            return utils.sendError.InternalError(err, res);
          }

          for(var field in req.body.folder) {
            if((field !== '_id') && (field !== undefined)) {
              doc[field] = req.body.folder[field];
            }
          }

          if(req.body.folder.isTopLevel) {
            doc.parent = null;
          }

          doc.save(function (err, folder) {
            var data = {'folder': folder};
            utils.sendResponse(res, data);
          });
        }
      );
    } else {
      logger.info("permission denied");
      res.send(403, "You don't have permission for this workspace");
    }
  });
}

module.exports.get.folderSets = getFolderSets;
module.exports.get.folder = getFolder;
module.exports.get.folders = getFolders;
module.exports.post.folder = postFolder;
module.exports.put.folder = putFolder;
