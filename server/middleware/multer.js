/**
 * # Multer - file upload
 * @description Multer is used to upload files to an express app
 *   The files are currently being stored in ${process.env.BUILD_DIR}/image_uploads
 *   When a user uploads a file, a folder with their username is created
 *   Currently supports images and pdfs for upload
 * @author Daniel Kelly
 * @since 2.0.0
 * @todo A better message response to user on failure.
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config();

const {  requireUser } = require('./userAuth');

const buildDestination = function (req, fileInfo, next) {
  console.log('build destination is running');
  let user = requireUser(req);
  if (!user) {
    return next(new Error('No user logged in'));
  }
    // Generate error if the destination folder does not exist.
    let buildDir = 'build';
    if (process.env.BUILD_DIR) {
      buildDir = process.env.BUILD_DIR;
    }
    let dest = path.resolve(process.cwd(), `${buildDir}/image_uploads/tmp_pdfs`);
    fs.access(dest, fs.constants.F_OK, (err) => {
      if (err) {
        let errResp = `ERROR - PDF Images directory ${dest} does not exist - ${err}`;
        console.error(errResp);
        next(err);
      }
    });

    next(null, dest);
  };

  const filename = (req, file, next) => {
    const ext = file.mimetype.split('/')[1];
    next(null, file.fieldname + '-' + Date.now() + '.'+ext);
  };

    const fileFilter = (req, file, next) => {
      if (!file) {
        next();
      }
      const image = file.mimetype.startsWith('image/');
      const pdf = file.mimetype.startsWith('application/pdf');
      if (image) {
        console.log('photo uploaded');
        next(null, true);
      } else if (pdf) {
        console.log('pdf uploaded');
        next(null, true);
      } else {
        console.log("file not supported");

    //TODO:  A better message response to user on failure.
    return next();
  }
};

// const config = multer({
//   storage: multer.diskStorage({
//    //Setup where the user's file will go
//    destination: function(req, file, next){
//      next(null, imageFolder);
//      },

//       //Then give the file a unique name
//       filename: function(req, file, next){
//           console.log(file);
//           const ext = file.mimetype.split('/')[1];
//           next(null, file.fieldname + '-' + Date.now() + '.'+ext);
//         }
//       }),

//       //A means of ensuring only images are uploaded.
//       fileFilter: function(req, file, next){
//         if(!file){
//               next();
//             }
//           const image = file.mimetype.startsWith('image/');
//           if(image){
//             console.log('photo uploaded');
//             next(null, true);
//           }else{
//             console.log("file not supported");

//             //TODO:  A better message response to user on failure.
//             return next();
//           }
//       }
//     });

//module.exports.config = config;
module.exports.buildDestination = buildDestination;
module.exports.fileFilter = fileFilter;
module.exports.filename = filename;
