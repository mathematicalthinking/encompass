/* jshint ignore:start */
/**
  * # Image API
  * @description This is the API for image based requests
  * @author Daniel Kelly
*/

//REQUIRE MODULES
const _ = require('underscore');
const logger = require('log4js').getLogger('server');
const path = require('path');

//REQUIRE FILES
const models = require('../schemas');
const auth = require('./auth');
const userAuth = require('../../middleware/userAuth');
const permissions  = require('../../../common/permissions');
const utils    = require('../../middleware/requestHandler');
const PDFImage = require('pdf-image').PDFImage;


module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @public
  * @method getImages
  * @description __URL__: /api/images
  * @returns {Object} An array of image objects
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

const getImages = (req, res, next) => {
  const criteria = utils.buildCriteria(req);
  const user = userAuth.requireUser(req);

  models.Image.find(criteria)
  .exec((err, images) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = {'images': images};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method getImage
  * @description __URL__: /api/image/:id
  * @returns {Object} An image object
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

const getImage = (req, res, next) => {
  models.Image.findById(req.params.id)
  .exec((err, image) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = {'image': image };
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method postImage
  * @description __URL__: /api/images
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
  */

const postImages = async function(req, res, next) {
  const user = userAuth.requireUser(req);
  let docs;
  let isPDF = req.mimeType === 'application/pdf';
  // who can create images - add permission here
  if (!req.files) {
    return utils.sendError.InvalidContentError('No files to upload!', res);
  }

  if (isPDF) {
    const files = req.files.map((f) => {
      console.log('inside isPdf for post Images');
      let img = new models.Image(f);
      img.createdBy = user;
      img.createdDate = Date.now();
      const ix = img.path.indexOf('image_uploads');
      img.relativePath = img.path.slice(ix);
      let pdfImage = new PDFImage(img);
      console.log('pdfImage is', pdfImage);
      return img;
      // pdfImage.convertPage(0).then(function (imagePath) {
      //   console.log('inside pdf image convert page');
      //   // 0-th page (first page) of the slide.pdf is available as slide-0.png
      //   fs.existsSync("/tmp/slide-0.png"); // => true
      });
      try {
        docs = await Promise.all(files.map((f) => {
          return f.save();
        }));
        const data = {
          'images': docs
        };
        return utils.sendResponse(res, data);
      } catch (err) {
        return utils.sendError.InternalError(err, res);
      }
  }

  const files = req.files.map((f) => {
    let data = f.buffer;
    let mimeType = f.mimetype;

    let str = data.toString('base64');
    let alt = '';
    let format = `data:${mimeType};base64,`;

    let imgSrc = `<img alt="${alt}" src="data:${mimeType};base64,${str}`;
    let imgData = `${format}${str}`;

    let img = new models.Image(f);
    img.createdBy = user;
    img.createDate = Date.now();
    img.data = imgData;
    img.isPdf = isPdf;
    // const ix = img.path.indexOf('image_uploads');
    // img.relativePath = img.path.slice(ix);
    return img;
  });

  try {
    docs = await Promise.all(files.map((f) => {
      return f.save();
    }));
    const data = {'images': docs};
    return utils.sendResponse(res, data);
  }catch(err) {
    return utils.sendError.InternalError(err, res);
  }



  // const images = new models.Image(req.body.image);
  // image.createdBy = user;
  // image.createDate = Date.now();
  // image.save((err, doc) => {
  //   if (err) {
  //     logger.error(err);
  //     return utils.sendError.InternalError(err, res);
  //   }
  //   const data = {'image': files};
  //   utils.sendResponse(res, data);
  //   next();
  // });
};

/**
  * @public
  * @method putImage
  * @description __URL__: /api/images/:id
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
  */

const putImage = (req, res, next) => {
  const user = userAuth.requireUser(req);
  // Who can edit the image?
  models.Image.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // make the updates
    for(var field in req.body.image) {
      if((field !== '_id') && (field !== undefined)) {
        doc[field] = req.body.image[field];
      }
    }
    doc.save((err, image) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'image': image};
      utils.sendResponse(res, data);
    });
  });
};

module.exports.get.images = getImages;
module.exports.get.image = getImage;
module.exports.post.images = postImages;
module.exports.put.image = putImage;
/* jshint ignore:end */