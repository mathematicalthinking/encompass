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
const fs = require('fs');
const PDF2Pic = require('pdf2pic').default

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
  // who can create images - add permission here
  if (!req.files) {
    return utils.sendError.InvalidContentError('No files to upload!', res);
  }
  console.log('running post Images!!');

  const files = await Promise.all(req.files.map((f) => {
    let data = f.buffer;
    let mimeType = f.mimetype;
    let isPDF = mimeType === 'application/pdf';
    let img = new models.Image(f);

    if (isPDF) {
      console.log('inside isPdf for post Images');
      // img.createdBy = user;
      // img.createDate = Date.now();

      let converter = new PDF2Pic({
        density: 200, // output pixels per inch
        savename: img.name, // output file name
        savedir: './server/public/image_uploads', // output file location
        format: "png", // output file format
        size: 1000 // output size in pixels
      })

      function convertBase64(file) {
        let bitmap = fs.readFileSync(file);
        return new Buffer(bitmap).toString('base64');
      }

      let file = img.path;
      return converter.convertBulk(file)
        .then(results => {
          let files = results.map((result) => {
            return result.path;
          })
          let buffers = files.map((file) => {
            let f = {
              createdBy: user,
              createDate: Date.now()
            }
            let newImage = new models.Image(f);
            console.log('file is', file);
            let bitmap = fs.readFileSync(file);
            console.log('bitmap is', bitmap);
            buffer = new Buffer(bitmap).toString('base64');
            console.log('buffer is', buffer);

             //let str = data.toString('base64');
             //let alt = '';
             let format = `data:image/png;base64,`;
             let imgData = `${format}${buffer}`;
             newImage.data = imgData;
             return newImage;
          });
          let testbuffs = buffers.map(b => b.createdBy);
          console.log('testbuffs', testbuffs);
          return buffers;
          // files.forEach((file) => {
          //   console.log('file is', file);
          //   let bitmap = fs.readFileSync(file);
          //   console.log('bitmap is', bitmap);
          //   buffer = new Buffer(bitmap).toString('base64');
          //   console.log('buffer is', buffer);
          // });
        })
        .catch((err) => {
          console.log('error converting batch', err);
        });

      // return converter.convertToBase64(file)
      //   .then(resolve => {
      //     if (resolve.base64) {
      //       let data = resolve.base64;
      //       let str = data.toString('base64');
      //       let format = `data:image/png;base64,`;
      //       let imgData = `${format}${str}`;
      //       img.data = imgData;
      //       img.createdBy = user;
      //       img.createDate = Date.now();
      //       return img;
      //     }
      //   })
      //   .catch((err) => {
      //     console.log('error converting to base 64', err);
      //   });


    } else {
      let str = data.toString('base64');
      let alt = '';
      let format = `data:${mimeType};base64,`;
      let imgData = `${format}${str}`;

      img.createdBy = user;
      img.createDate = Date.now();
      img.data = imgData;
      img.isPdf = isPDF;
      return Promise.resolve(img);
    }


  }));
  console.log('files', files.length);
  let flattened = _.flatten(files);
  //console.log('flattened')


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