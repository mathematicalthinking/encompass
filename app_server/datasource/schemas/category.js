const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Category
  * @description Categories are used to categorize problems
  * @todo Create or use external categories for problem?
  */
var CategorySchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User' },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
  //====
  identifier: { type: String, required: true },
  description: { type: String },
  url: { type: String },

}, { versionKey: false });

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
// CategorySchema.pre('save', function (next) {
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
// CategorySchema.post('save', function (Category) {
//   var update = { $addToSet: { 'Categorys': Category } };
//   if (Category.isTrashed) {
//     var CategoryIdObj = mongoose.Types.ObjectId(Category._id);
//     /* + If deleted, all references are also deleted */
//     update = { $pull: { 'Categorys': CategoryIdObj } };
//   }

//   if (Category.workspace) {
//     mongoose.models.Workspace.update({ '_id': Category.workspace },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

//   if (Category.submission) {
//     mongoose.models.Submission.update({ '_id': Category.submission },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

// });

module.exports.Category = mongoose.model('Category', CategorySchema);
