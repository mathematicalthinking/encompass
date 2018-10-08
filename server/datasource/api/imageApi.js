/* jshint ignore:start */
/**
  * # Image API
  * @description This is the API for image based requests
  * @author Daniel Kelly
*/

//REQUIRE MODULES
const _ = require('underscore');
const logger = require('log4js').getLogger('server');

//REQUIRE FILES
const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils    = require('../../middleware/requestHandler');
const fs = require('fs');
const PDF2Pic = require('pdf2pic').default;
require('dotenv').config();


module.exports.get = {};
module.exports.post = {};
module.exports.put = {};
module.exports.delete = {};

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

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

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
    if (!image || image.isTrashed) {
      return utils.sendResponse(res, null);
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


const readFilePromise = function(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('failure extreme failure'));
    }
    fs.readFile(file, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
    });
  });
};

const postImages = async function(req, res, next) {
  const user = userAuth.requireUser(req);
  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }
  let docs;
  // who can create images - add permission here
  if (!req.files) {
    return utils.sendError.InvalidContentError('No files to upload!', res);
  }

  const files = await Promise.all(req.files.map((f) => {
    let data = f.buffer;
    let mimeType = f.mimetype;
    let isPDF = mimeType === 'application/pdf';
    let img = new models.Image(f);

    let buildDir = 'build';
    if (process.env.BUILD_DIR) {
      buildDir = process.env.BUILD_DIR;
    }
    const saveDir = `./${buildDir}/image_uploads/tmp_pngs`;
    fs.access(saveDir, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`ERROR - PNG Images directory ${saveDir} does not exist`);
      }
    });

    if (isPDF) {
      let converter = new PDF2Pic({
        density: 200, // output pixels per inch
        savename: img.name, // output file name
        savedir: saveDir, // output file location
        format: "png", // output file format
        size: 1000 // output size in pixels
      });
      let file = img.path;
      return converter.convertBulk(file)
        .then(results => {
          let files = results.map((result) => {
            return result.path;
          });
          return Promise.all(files.map((file) => {
            let f = {
              createdBy: user,
              createDate: Date.now(),
              originalname: img.originalname
            };
            return readFilePromise(file).then((data) => {
              let newImage = new models.Image(f);
              let buffer = Buffer.from(data).toString('base64');
              let format = `data:image/png;base64,`;
              let imgData = `${format}${buffer}`;

                newImage.imageData = imgData;
                return newImage;
            })
            .catch((err) => {
              console.log('error converting', err);
            });
          }));
        })
        .catch((err) => {
          console.error(`Pdf conversion error: ${err}`);
          console.trace();
          return utils.sendError.InternalError(err, res);
        });
    } else {
      let str = data.toString('base64');
      let format = `data:${mimeType};base64,`;
      let imgData = `${format}${str}`;

      img.createdBy = user;
      img.createDate = Date.now();
      img.imageData = imgData;
      return Promise.resolve(img);
    }


  }));
  let flattened = _.flatten(files);

  try {
    docs = await Promise.all(flattened.map((f) => {
      return f.save();
    }));
    const data = {'images': docs};
    return utils.sendResponse(res, data);
  } catch(err) {
    return utils.sendError.InternalError(err, res);
  }

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

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

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

/**
 * @public
 * @method deleteImage
 * @description __URL__: /api/images/:id
 * @throws {NotAuthorizedError} User has inadequate permissions
 * @throws {InternalError} Data update failed
 * @throws {RestError} Something? went wrong
 */

const deleteImage = (req, res) => {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Image.findByIdAndRemove(req.params.id, (err, image) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    let createdBy = image.createdBy;

    if (createdBy.toString() !== user._id.toString()) {
      console.log('user did not create this image');
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }

    const data = {
      message: 'Image successfully deleted',
      id: image._id
    };
    return utils.sendResponse(res, data);
  });
};

module.exports.get.images = getImages;
module.exports.get.image = getImage;
module.exports.post.images = postImages;
module.exports.put.image = putImage;
module.exports.delete.image = deleteImage;
/* jshint ignore:end */
