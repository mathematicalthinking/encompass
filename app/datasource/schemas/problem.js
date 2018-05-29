var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require('underscore'),
  ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Problem
  * @description Problems are submitted by teachers
  */
var ProblemSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User' },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  //====
  title: { type: String },
  puzzleId: { type: Number },
  text: { type: String },
  image: { type: String },
  sourceUrl: { type: String },
  additionalInfo: { type: String },
  isPublic: { type: Boolean, default: false },
  categories: [{ type: ObjectId, ref: 'Category' }]
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
