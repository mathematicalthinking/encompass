/**
  * # Folder API
  * @description This is the API for folder based requests
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */

//REQUIRE MODULES
const logger   = require('log4js').getLogger('server');
const _ = require('underscore');

//REQUIRE FILES
const utils    = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');
const models   = require('../schemas');
const wsAccess   = require('../../middleware/access/workspaces');
const access = require('../../middleware/access/folders');
const fsAccess = require('../../middleware/access/foldersets');

const { isNil, isNonEmptyArray } = require('../../utils/objects');
const {  areObjectIdsEqual } = require('../../utils/mongoose');


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

  let criteria = fsAccess.get.folderSets(user, req.query.ids);
  if (isNil(criteria)) {
    return utils.sendError.NotAuthorizedError(null, res);
  }

  return models.FolderSet.find(criteria).lean().exec()
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
async function postFolder(req, res, next) {
  try {
    let user = userAuth.requireUser(req);
    let workspaceId = req.body.folder.workspace;

    let workspace = await models.Workspace.findById(workspaceId).lean().populate('owner').populate('editors').populate('createdBy').exec();

    let canCreateFolderInWs = wsAccess.canModify(user, workspace, 'folders', 2);

    if (!canCreateFolderInWs) {
      logger.info("permission denied");
      return utils.sendError.NotAuthorizedError(`You don't have permission for this workspace`, res);
    }

    let folder = new models.Folder(req.body.folder);
    folder.createdBy = user;
    folder.createDate = Date.now();
    folder.lastModifiedDate = Date.now();
    folder.lastModifiedBy = user;

    await folder.save();

    let parentWorkspacesToUpdate = await models.Workspace.find({isTrashed: false, childWorkspaces: workspaceId, doAutoUpdateFromChildren: true}).populate('folders');

    if (isNonEmptyArray(parentWorkspacesToUpdate)) {
      await Promise.all(parentWorkspacesToUpdate.map((parentWs) => {
        let folderCopy = { ...folder.toObject() };
        let oldId = folderCopy._id;
        delete folderCopy._id;

        folderCopy.originalFolder = oldId;
        folderCopy.workspace = parentWs._id;
        // should folder owner be original owner or owner of parent ws?
        folderCopy.owner = parentWs.owner;

        let isTopLevel = isNil(folder.parent);

        if (isTopLevel) {
          // need to set parent as the 'workspace' folder
          let childWsFolder = _.find(parentWs.folders, (f) => {
            return areObjectIdsEqual(f.srcChildWs, workspaceId);
          });

          if (!childWsFolder) {
            // should never happen
            logger.info('missing child ws folder');
            return;
          }
          folderCopy.parent = childWsFolder;
        } else {
          // find corresponding parent folder in parent ws
          let parentWsParent = _.find(parentWs.folders, (f) => {
            return areObjectIdsEqual(f.originalFolder, folder.parent);
          });

          if (!parentWsParent) {
            // should never happen
            logger.info('missing parentws parent');
            return;
          }
          folderCopy.parent = parentWsParent;
        }
        logger.info('creating copy in parent');
        return models.Folder.create(folderCopy);
      }));

    }
    let data = { folder };
    utils.sendResponse(res, data);

  }catch(err) {
    logger.error('error postFolder: ', err);
    return utils.sendError.InternalError(err, res);
  }
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
    if(_.isEqual(user.id, req.body.folder.createdBy) || wsAccess.canModify(user, ws, 'folders', 3)) {
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
  return fsAccess.get.folderSet(user, id)
    .then((canLoadFolderSet) => {
      if (!canLoadFolderSet) {
        return;
      }
      return models.FolderSet.findById(id).lean().exec();
    })
    .then((folderSet) => {
      if (_.isUndefined(folderSet)) {
        return utils.sendError.NotAuthorizedError(null, res);
      }
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
