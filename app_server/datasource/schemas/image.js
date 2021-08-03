const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Image
  * @description Images are stored as base-64 strings. Note: they are uploaded and saved temporarily in ${buildDir}/image_uploads using multer.
  */
var ImageSchema = new Schema({
  // Currently only using encoding, mimetype, data
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User' },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
  //====
  originalname: { type: String }, // field from multer is all lowercase
  encoding: { type: String },
  mimetype: { type: String },
  destination:  { type: String }, //This should only be used if we aren't saving the data
  filename: { type: String }, //Not used yet
  imageData: { type: String },
  path: { type: String }, //Not used yet
  relativePath: { type: String }, //Not used yet
  pdfPageNum: { type: Number },
  originalWidth: {type: Number},
  originalHeight: { type: Number },
  originalSize: { type: Number },
  originalMimetype: {type: String},
  height: { type: Number },
  width: { type: Number },
  size: { type: Number },
}, { versionKey: false });

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
// ImageSchema.pre('save', function (next) {
//   var toObjectId = function (elem, ind, arr) {
//     if (!(elem instanceof mongoose.Types.ObjectId) && !_.isUndefined(elem)) {
//       arr[ind] = mongoose.Types.ObjectId(elem);
//     }
//   };

//   /** + Every ID reference in our object is properly typed.
//     *   This needs to be done BEFORE any other operation so
//     *   that native lookups and updates don't fail.
//     */
//   try {
//     this.selections.forEach(toObjectId);
//     this.comments.forEach(toObjectId);
//     next();
//   }
//   catch (err) {
//     next(new Error(err.message));
//   }
// });

/**
  * ## Post-Validation
  * After saving we must ensure (synchonously) that:
  */
// ImageSchema.post('save', function (Image) {
//   var update = { $addToSet: { 'Images': Image } };
//   if (Image.isTrashed) {
//     var ImageIdObj = mongoose.Types.ObjectId(Image._id);
//     /* + If deleted, all references are also deleted */
//     update = { $pull: { 'Images': ImageIdObj } };
//   }

//   if (Image.workspace) {
//     mongoose.models.Workspace.update({ '_id': Image.workspace },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

//   if (Image.submission) {
//     mongoose.models.Submission.update({ '_id': Image.submission },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

// });

module.exports.Image = mongoose.model('Image', ImageSchema);