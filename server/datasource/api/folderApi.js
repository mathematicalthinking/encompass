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
const userAuth = require('../../middleware/userAuth');
const models   = require('../schemas');
const wsAccess   = require('../../middleware/access/workspaces');
const access = require('../../middleware/access/folders');

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
async function getFolder(req, res, next) {
  try {
    const user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.InvalidCredentialsError('You must be logged in.', res);
    }

    let id = req.params.id;

    let folder = await models.Folder.findById(id);

    // record not found in db
    if (!folder || folder.isTrashed) {
      return utils.sendResponse(res, null);
    }

    let canLoadFolder = await access.get.folder(user, id);

    // user does not have permission to access folder
    if (!canLoadFolder) {
      return utils.sendError.NotAuthorizedError('You do not have permission.', res);
    }

    // user has permission; send back record
    const data = {
      folder
    };

    return utils.sendResponse(res, data);
  }catch(err) {
    console.error(`Error getFolder: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }
}

/**
  * @public
  * @method getFolderSets
  * @description __URL__: /api/folderSets
  * @returns {Object} A 'named' hardcoded list *for now*
  */
function getFolderSets(req, res, next) {
  let user = userAuth.requireUser(req);
  if (!user) {
    return utils.sendError.InvalidCredentialsError('You must be logged in.', res);
  }
  let { accountType, actingRole } = user;
  if (accountType === 'S' || actingRole === 'student') {
    return utils.sendError.NotAuthorizedError('You do not have permission.', res);
  }
return models.FolderSet.find({}).lean().exec()
  .then((folderSets => {
    const data = { folderSets };
    return utils.sendResponse(res, data);
  }))
  .catch((err) => {
    console.error(`Error getFolderSets: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  });
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
async function getFolders(req, res, next) {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }
  let ids = req.query.ids;
  let criteria;
  try {
    criteria = await access.get.folders(user, ids);

  }catch(err) {
    console.error(`Error building folders criteria: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }

  models.Folder.find(criteria)
    .exec(function(err, folders) {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
    const data = {'folders': folders};
    return utils.sendResponse(res, data);
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
  models.Workspace.findById(workspaceId).lean().populate('owner').populate('editors').populate('createdBy').exec(function(err, ws){
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    if(wsAccess.canModify(user, ws, 'folders', 2)) {
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
      return utils.sendError.NotAuthorizedError(`You don't have permission for this workspace`, res);
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
  models.Workspace.findOne({folders: req.params.id}).lean().populate('owner').populate('editors').populate('createdBy').exec(function(err, ws){
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    logger.warn("PUTTING FOLDER: " + JSON.stringify(req.body.folder) );
    if(wsAccess.canModify(user, ws, 'folders', 3)) {
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
            if (err) {
              logger.error(err);
              return utils.sendError.InternalError(err, res);
            }
            var data = {'folder': folder};
            utils.sendResponse(res, data);
          });
        }
      );
    } else {
      logger.info("permission denied");
      return utils.sendError.NotAuthorizedError(`You don't have permission for this workspace`, res);
    }
  });
}

function getFolderSet(req, res, next) {
  const user = userAuth.requireUser(req);
  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  const { id } = req.params;

  if (!id) {
    return utils.sendError.InvalidContentError(null, res);
  }

  return models.FolderSet.findById(id).lean().exec()
    .then((folderSet) => {
      const data = { folderSet };
      return utils.sendResponse(res, data);
    })
    .catch((err) => {
      console.error(`Error getFolderSet: ${err}`);
      console.trace();
      return utils.sendError.InternalError(null, res);
    });
}

async function postFolderSet(req, res, next) {
  try {
    const user = userAuth.requireUser(req);



    if (!user) {
      return utils.sendError.InvalidCredentialsError('No user logged in!', res);
    }

    const { folderSet } = req.body;

    if (!folderSet) {
      return utils.sendError.InvalidContentError(null, res);
    }

    const { name, privacySetting, folders } = folderSet;

    const record = new models.FolderSet({
      name,
      privacySetting,
      folders,
      createdBy: user._id,
      lastModifiedBy: user._id
    });

    const saved = await record.save();
    const data = { folderSet: saved };
    return utils.sendResponse(res, data);


  }catch(err) {
    console.error(`Error postFolderSet: ${err}`);
    console.trace();
    return utils.sendError.InternalError(err, res);
  }
}

module.exports.get.folderSets = getFolderSets;
module.exports.get.folder = getFolder;
module.exports.get.folders = getFolders;
module.exports.post.folder = postFolder;
module.exports.put.folder = putFolder;
module.exports.post.folderSet = postFolderSet;
module.exports.get.folderSet = getFolderSet;
