/**
  * # Selections API
  * @description This is the API for selection based requests
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */

//REQUIRE MODULES
const logger   = require('log4js').getLogger('server');
const sharp = require('sharp');

//REQUIRE FILES
const utils    = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');
const models   = require('../schemas');
const wsAccess   = require('../../middleware/access/workspaces');
const access = require('../../middleware/access/selections');

const { isValidMongoId } = require('../../utils/mongoose');


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

function getImageData(src) {
  if (typeof src !== 'string') {
    return;
  }

  let first30Chars = typeof src === 'string' ? src.slice(0,29) : '';

  let target = 'base64,';
  let targetIndex = first30Chars.indexOf(target);

  // src was base64 image data so just return that
  if (targetIndex !== -1) {
    let dataStartIndex = targetIndex + target.length;
    // does not include last char which is closing quote
    let imageDataStr = src.slice(dataStartIndex);

    // let dataFormatStartIndex = first30Chars.indexOf('data:');
    // let imageDataStrWithFormat = src.slice(dataFormatStartIndex);
    return imageDataStr;
  }

  // /api/images/file/IMAGE_ID

  let lastSlashIx = src.lastIndexOf('/');

  if (lastSlashIx === -1) {
    return;
  }

  let imageId = src.slice(lastSlashIx + 1);

  if (!isValidMongoId(imageId)) {
    return;
  }

  return models.Image.findById(imageId).lean().exec()
    .then((image) => {
      if (image) {
        let imageData = image.imageData;
        let target = 'base64,';
        let targetIx = imageData.indexOf(target);
        if (targetIx !== -1) {
          return imageData.slice(targetIx + target.length);
        }
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
async function postSelection(req, res, next) {
  try {
    let user = userAuth.requireUser(req);
    let workspaceId = req.body.selection.workspace;

    let ws = await models.Workspace.findById(workspaceId).lean().populate('owner').populate('editors').populate('createdBy').lean().exec();

    if (!wsAccess.canModify(user, ws, 'selections', 2)) {
      return utils.sendError.NotAuthorizedError('You don\'t have permission for this workspace', res);
    }

    let selection = new models.Selection(req.body.selection);

    selection.createdBy = user;
    selection.createDate = Date.now();


    let coordinates = selection.coordinates;
    let splitCoords = coordinates.split(' ');

    let selectionType = splitCoords.length === 5 ? 'image' : 'text';

    if (selectionType === 'image') {
      // crop image based on selection and create thumbnail
      let imageSrc = selection.imageSrc;

      let imageData = await getImageData(imageSrc);
      console.log('imageSrc selection api', imageData.slice(0,100));

      if (imageData) {
        let bytes = Buffer.from(imageData, 'base64');

        let sharpInstance = sharp(bytes);

        let sharpMetadata = await sharpInstance.metadata();

        let { width, height } = sharpMetadata;

        let { relativeSize, relativeCoords } = selection;

        let croppedLeft = Math.floor(relativeCoords.tagLeftPct * width);
        let croppedTop = Math.floor(relativeCoords.tagTopPct * height);

        let croppedWidth = Math.floor(relativeSize.widthPct * width);
        let croppedHeight = Math.floor(relativeSize.heightPct * height);

        let extraction = await sharp(bytes)
          .extract({left: croppedLeft, top: croppedTop, width: croppedWidth, height: croppedHeight })
          .toBuffer();

        let newMetadata = await sharp(extraction).metadata();
        console.log('new tag metadata', newMetadata);
        let croppedImageData = extraction.toString('base64');

        let croppedImage = new models.Image({
          size: newMetadata.size,
          width: newMetadata.width,
          height: newMetadata.height,
          mimetype: `image/${newMetadata.format}`,
          imageData: `data:image/${newMetadata.format};base64,${croppedImageData}`,
          createdBy: user,
          createDate: Date.now()
        });

        await croppedImage.save();

        let url = `/api/images/file/${croppedImage._id}`;

        selection.imageTagLink = url;
      }

    }

    let savedSelection = await selection.save();

    let data = {'selection': savedSelection};

    return utils.sendResponse(res, data);

  }catch(err) {
    console.error(`Error postSelection: ${err}`);
    console.trace();
    return utils.sendError.InternalError(err, res);

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
