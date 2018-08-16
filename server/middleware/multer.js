/**
 * # Multer - file upload
 * @description Multer is used to upload files to an express app
 *   The files are currently being stored in server/public/image_uploads
 *   When a user uploads a file, a folder with their username is created
 *   Currently supports images and pdfs for upload
 * @author Daniel Kelly
 * @since 2.0.0
 * @todo A better message response to user on failure.
 */

const multer = require('multer');
const path = require('path');
const imageFolder = path.resolve(__dirname, 'image_upload');
const utils = require('../middleware/requestHandler');
const fs = require('fs');


  const buildDestination = function(req, res, file, next) {
    console.log('build destination is running');
    if (!req.user) {
      return utils.sendError.InvalidCredentialsError('Unauthenticated request', res);
    }
    let isPdf = file.mimetype.startsWith('application/pdf');
    console.log('isPdf', isPdf);

    if (isPdf) {
      const rootPath = process.cwd();
      const username = req.user.username || 'anonymous';
      let dest = path.resolve(rootPath, `server/public/image_uploads/${username}`);
      fs.mkdir(dest, (err) => {
        if (err) {
          console.log(err);
        }
        next(null, dest);
      });
    }
    };

    const filename = (req, file, next) => {
    const ext = file.mimetype.split('/')[1];
    next(null, file.fieldname + '-' + Date.now() + '.'+ext);
  };

    const fileFilter = (req, file, next) => {
    if(!file){
          next();
        }
      const image = file.mimetype.startsWith('image/');
      const pdf = file.mimetype.startsWith('application/pdf');
      if(image){
        console.log('photo uploaded');
        next(null, true);
      } else if (pdf) {
        console.log('pdf uploaded');
        next(null, true);
      }else{
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