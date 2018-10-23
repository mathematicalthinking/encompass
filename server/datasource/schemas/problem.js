const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Problem
  * @description Problems are submitted by teachers, we allow image uploads
  * @todo Allow images to be used as supplment or entire problem?
  */
var ProblemSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
  //====
  title: { type: String, required: true },
  puzzleId: { type: Number },  // old POWs converted puzzle id
  text: { type: String },
  imageUrl: { type: String },
  sourceUrl: { type: String },
  image: { type: ObjectId, ref: 'Image' },
  additionalInfo: { type: String },
  origin: { type: ObjectId, ref: 'Problem' },
  modifiedBy: { type: ObjectId, ref: 'User' },
  privacySetting: { type: String, enum: ['M', 'O', 'E'] },
  copyrightNotice: { type: String },
  sharingAuth: { type: String },
  organization: { type: ObjectId, ref: 'Organization' },
  categories: [{ type: ObjectId, ref: 'Category' }],
  keywords: [{ type: String }],
  isUsed: { type: Boolean, 'default': false },
  status: { type: String, enum: ['approved', 'pending', 'flagged'] },
  flagReason: { type: String }
}, { versionKey: false });


/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
// ProblemSchema.pre('save', function (next) {
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
// ProblemSchema.post('save', function (Problem) {
//   var update = { $addToSet: { 'Problems': Problem } };
//   if (Problem.isTrashed) {
//     var ProblemIdObj = mongoose.Types.ObjectId(Problem._id);
//     /* + If deleted, all references are also deleted */
//     update = { $pull: { 'Problems': ProblemIdObj } };
//   }

//   if (Problem.workspace) {
//     mongoose.models.Workspace.update({ '_id': Problem.workspace },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

//   if (Problem.submission) {
//     mongoose.models.Submission.update({ '_id': Problem.submission },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

// });



module.exports.Problem = mongoose.model('Problem', ProblemSchema);
