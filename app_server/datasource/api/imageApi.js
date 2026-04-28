/**
 * # Image API
 * @description This is the API for image based requests
 * @author Daniel Kelly, Crispina Muriel
 */

//REQUIRE MODULES
const _ = require('underscore');
const logger = require('log4js').getLogger('server');
const sharp = require('sharp');
const path = require('path');
const { spawnSync } = require('child_process');

//REQUIRE FILES
const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils = require('../../middleware/requestHandler');
const fs = require('fs');

//REQUIRE PDF2PIC DEPENDANCIES
const { fromPath } = require('pdf2pic');
// const { mkdirsSync } = require("fs-extra");
// const rimraf = require("rimraf");

// const pdfParse = require('pdf-parse');

const { isNonEmptyString } = require('../../utils/objects');

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

  models.Image.find(criteria).exec((err, images) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = { images: images };
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
  models.Image.findById(req.params.id).exec((err, image) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    if (!image || image.isTrashed) {
      return utils.sendResponse(res, null);
    }
    const data = { image: image };
    utils.sendResponse(res, data);
    next();
  });
};

function getMimetypeFromImageData(imageData) {
  let first30Chars =
    typeof imageData === 'string' ? imageData.slice(0, 29) : '';

  if (first30Chars.indexOf('png') !== -1) {
    return 'image/png';
  }
  if (
    first30Chars.indexOf('jpeg') !== -1 ||
    first30Chars.indexOf('jpg') !== -1
  ) {
    return 'image/jpeg';
  }

  if (first30Chars.indexOf('gif') !== -1) {
    return 'image/gif';
  }
  return null;
}

const getImageFile = (req, res, next) => {
  return models.Image.findById(req.params.id)
    .lean()
    .exec()
    .then((image) => {
      if (!image || image.isTrashed || !isNonEmptyString(image.imageData)) {
        return utils.sendResponse(res, null);
      }

      let imageData = image.imageData;
      let target = 'base64,';
      let targetIx = imageData.indexOf(target);
      let sliced = imageData.slice(targetIx + target.length);
      let buffer = Buffer.from(sliced, 'base64');

      let mimetype = image.mimetype;

      if (!isNonEmptyString(mimetype)) {
        mimetype = getMimetypeFromImageData(imageData);
        if (mimetype === null) {
          return utils.sendError.InvalidContentError(
            `Image contains invalid or unsupported data.`,
            res
          );
        }
      }

      res.contentType(mimetype);
      return res.send(buffer);
    })
    .catch((err) => {
      console.error(`Error getImageFile: ${err}`);
      console.trace();
      return utils.sendError.InternalError(null, res);
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

const readFilePromise = function (file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('invalid or missing file provided'));
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};

const safeUnlink = async function (filePath) {
  if (!isNonEmptyString(filePath)) {
    return;
  }
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Error removing temporary file ${filePath}: ${err}`);
    }
  }
};

const EXTRA_BINARY_PATHS = ['/opt/homebrew/bin', '/usr/local/bin'];

const getMergedBinaryPath = function () {
  let pathParts = [];
  if (isNonEmptyString(process.env.PATH)) {
    pathParts = process.env.PATH.split(':');
  }

  const merged = [...new Set([...pathParts, ...EXTRA_BINARY_PATHS])].filter(
    (p) => isNonEmptyString(p)
  );

  return merged.join(':');
};

const getBinaryCheckEnv = function () {
  return {
    ...process.env,
    PATH: getMergedBinaryPath(),
  };
};

let runtimePathEnsured = false;

const ensureRuntimeBinaryPath = function () {
  if (runtimePathEnsured) {
    return;
  }

  const mergedPath = getMergedBinaryPath();
  if (isNonEmptyString(mergedPath)) {
    process.env.PATH = mergedPath;
  }

  runtimePathEnsured = true;
};

const canRunBinary = function (bin, args = ['--version']) {
  try {
    const result = spawnSync(bin, args, {
      stdio: 'ignore',
      env: getBinaryCheckEnv(),
    });
    return result.status === 0;
  } catch (_err) {
    return false;
  }
};

let pdfEngineInfoCache = null;
const DEFAULT_MAX_PDF_PAGES = 300;

const getMaxPdfPages = function () {
  const parsed = parseInt(process.env.PDF_CONVERSION_MAX_PAGES, 10);
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }
  return DEFAULT_MAX_PDF_PAGES;
};

const isOutOfRangePageError = function (message) {
  if (!isNonEmptyString(message)) {
    return false;
  }
  const normalized = message.toLowerCase();

  return (
    normalized.includes('requested first page') ||
    normalized.includes('number of pages in file') ||
    normalized.includes('does not contain page') ||
    normalized.includes('no pages will be processed')
  );
};

const convertPdfPagesSequentially = async function (convert) {
  const maxPages = getMaxPdfPages();
  const results = [];

  for (let page = 1; page <= maxPages; page++) {
    try {
      const fileObj = await convert(page);
      results.push(fileObj);
    } catch (err) {
      const message = err?.message || `${err}`;
      if (results.length > 0 && isOutOfRangePageError(message)) {
        break;
      }
      throw err;
    }
  }

  if (results.length === 0) {
    throw new Error('PDF conversion produced no pages.');
  }

  return results;
};

const detectPdfEngineInfo = function () {
  const hasGM = canRunBinary('gm', ['version']);
  const hasConvert = canRunBinary('convert', ['-version']);
  const hasGhostscript = canRunBinary('gs', ['--version']);

  let engine = null;
  if (hasGM) {
    engine = 'graphicsmagick';
  } else if (hasConvert) {
    engine = 'imagemagick';
  }

  return { engine, hasGhostscript };
};

const getPdfEngineInfo = function () {
  if (
    pdfEngineInfoCache &&
    pdfEngineInfoCache.engine &&
    pdfEngineInfoCache.hasGhostscript
  ) {
    return pdfEngineInfoCache;
  }

  const detected = detectPdfEngineInfo();
  if (detected.engine && detected.hasGhostscript) {
    pdfEngineInfoCache = detected;
  }

  return detected;
};

const postImages = async function (req, res, next) {
  try {
    // Make sure subprocesses started by pdf2pic/gm can see system binaries.
    ensureRuntimeBinaryPath();

    const user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.InvalidCredentialsError('No user logged in!', res);
    }
    let docs;
    // who can create images - add permission here
    if (!req.files) {
      return utils.sendError.InvalidContentError('No files to upload!', res);
    }

    let buildDir = process.env.BUILD_DIR || 'build';
    const saveDir = path.resolve(
      process.cwd(),
      `${buildDir}/image_uploads/tmp_pngs`
    );
    await fs.promises.mkdir(saveDir, { recursive: true });

    let sizeThreshold = 614400; // 600kb
    let widthThreshold = 1000; // 1000 pixels wide max

    const files = await Promise.all(
      req.files.map(async (f) => {
        let data = f.buffer;
        let mimeType = f.mimetype;
        let isPDF = mimeType === 'application/pdf';

        if (isPDF) {
          const { engine, hasGhostscript } = getPdfEngineInfo();
          if (!engine || !hasGhostscript) {
            throw new Error(
              "PDF conversion requires GraphicsMagick or ImageMagick ('convert') plus Ghostscript ('gs') on the server."
            );
          }

          let sourcePdfPath = f.path;
          if (!isNonEmptyString(sourcePdfPath)) {
            throw new Error('Missing PDF path for conversion');
          }

          let sourceBase = path.parse(
            f.filename || f.originalname || `pdf-${Date.now()}`
          ).name;
          sourceBase = sourceBase.replace(/[^a-zA-Z0-9_-]/g, '_');
          let saveName = `${sourceBase || 'pdf'}-${Date.now()}`;

          // https://www.npmjs.com/package/pdf2pic#usage
          // https://github.com/yakovmeister/pdf2pic-examples/blob/master/from-file-to-images.js
          const options = {
            density: 100, // output pixels per inch
            saveFilename: saveName, // output file name
            savePath: saveDir, // output file location
            format: 'png', // output file format
            // size: 500 // output size in pixels
            width: 500,
            height: 646,
          };

          const convert = fromPath(sourcePdfPath, options);
          if (engine === 'imagemagick') {
            convert.setGMClass(true);
          }

          // TODO: complete edgecase for large pdfs
          // let pdfBuffer = await readFilePromise(file);
          // let pdfParsed = await pdfParse(pdfBuffer);

          // let pageCount = pdfParsed.numpages;

          // let pageOptionsArr = [];
          // let maxPages = 50;
          // for (let i = 1; i <= maxPages; i++) {
          //   pageOptionsArr.push(i);
          // }

          // let pageOptions = pageCount > maxPages ? pageOptionsArr : -1;

          try {
            let results;
            try {
              results = await convertPdfPagesSequentially(convert);
            } catch (err) {
              const message = err?.message || `${err}`;
              if (/not authorized .*PDF/i.test(message)) {
                throw new Error(
                  'ImageMagick security policy is blocking PDF conversion. Enable PDF in policy.xml or use GraphicsMagick.'
                );
              }
              throw new Error(
                `PDF conversion failed: ${message}. Ensure 'convert' and 'gs' are available in PATH for the server process.`
              );
            }
            return Promise.all(
              results.map(async (fileObj) => {
                let pagePath = fileObj.path;
                let pageNum = fileObj.page;

                let newFile = {
                  createdBy: user,
                  createDate: Date.now(),
                  originalname: f.originalname,
                  pdfPageNum: pageNum,
                  mimetype: 'image/png',
                };

                try {
                  let pageData = await readFilePromise(pagePath);
                  let newImage = new models.Image(newFile);

                  let buffer = Buffer.from(pageData).toString('base64');
                  let format = `data:image/png;base64,`;
                  let imgData = `${format}${buffer}`;
                  newImage.imageData = imgData;
                  return newImage;
                } finally {
                  await safeUnlink(pagePath);
                }
              })
            );
          } finally {
            await safeUnlink(sourcePdfPath);
          }
        } else {
          // not PDF
          let originalSharp = sharp(data);
          let metadata = await originalSharp.metadata();

          let { width, height, size, format } = metadata;

          let img = new models.Image({
            createdBy: user,
            createDate: Date.now(),
            originalname: f.originalname,
            originalSize: size,
            originalWidth: width,
            originalHeight: height,
            originalMimetype: `image/${format}`,
          });

          let isOverSizeLimit = size > sizeThreshold;
          let isOverWidthLimit = width > widthThreshold;

          if (!isOverSizeLimit && !isOverWidthLimit) {
            img.size = size;
            img.width = width;
            img.height = height;
            img.mimetype = `image/${format}`;

            let imgString = data.toString('base64');

            img.imageData = `data:image/${format};base64,${imgString}`;

            return Promise.resolve(img);
          } else {
            // resize

            let resizedBuffer = await originalSharp.resize(500).toBuffer();
            let newMetadata = await sharp(resizedBuffer).metadata();

            img.size = newMetadata.size;
            img.width = newMetadata.width;
            img.height = newMetadata.height;
            img.mimetype = `image/${newMetadata.format}`;

            let imgDataStr = resizedBuffer.toString('base64');

            img.imageData = `data:image/${format};base64,${imgDataStr}`;

            return Promise.resolve(img);
          }
        }
      })
    );
    let flattened = _.flatten(files);

    docs = await Promise.all(
      flattened.map((f) => {
        return f.save();
      })
    );
    const data = { images: docs };
    return utils.sendResponse(res, data);
  } catch (err) {
    console.error(`Error postImages: ${err}`);
    console.trace();
    return utils.sendError.InternalError(err?.message || err, res);
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
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // make the updates
    for (var field in req.body.image) {
      if (field !== '_id' && field !== undefined) {
        doc[field] = req.body.image[field];
      }
    }
    doc.save((err, image) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = { image: image };
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
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }

    const data = {
      message: 'Image successfully deleted',
      id: image._id,
    };
    return utils.sendResponse(res, data);
  });
};

module.exports.get.images = getImages;
module.exports.get.image = getImage;
module.exports.post.images = postImages;
module.exports.put.image = putImage;
module.exports.delete.image = deleteImage;
module.exports.get.imageFile = getImageFile;
