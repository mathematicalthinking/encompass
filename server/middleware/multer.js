const multer = require('multer');
const path = require('path');
const imageFolder = path.resolve(__dirname, 'image_upload');
const utils = require('../middleware/requestHandler');
const fs = require('fs');

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

    const buildDestination = function(req, res, next) {
      if (!req.user) {
        return utils.sendError.InvalidCredentialsError('Unauthenticated request', res);
      }
      const rootPath = process.cwd();
      const username = req.user.username || 'anonymous';
      let dest = path.resolve(rootPath, `server/image_uploads/${username}`);
      fs.mkdir(dest, (err) => {
        if (err) {
          console.log(err);
        }
          next(null, dest);
      });
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
        if(image){
          console.log('photo uploaded');
          next(null, true);
        }else{
          console.log("file not supported");

          //TODO:  A better message response to user on failure.
          return next();
        }
     };

    module.exports.config = config;
    module.exports.buildDestination = buildDestination;
    module.exports.fileFilter = fileFilter;
    module.exports.filename = filename;