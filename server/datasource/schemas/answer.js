var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require('underscore'),
  ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Answer
  * @description Answers are a student's response to a problem
  */
var AnswerSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User' },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  //====
  studentId: { type: ObjectId, ref: 'User' },
  studentName: { type: String },
  problemId: { type: ObjectId, ref: 'Problem' },
  answer: { type: String },
  explanation: { type: String },
  sectionId: { type: ObjectId, ref: 'Section' },
  isSubmitted: { type: Boolean }
}, { versionKey: false });

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
// AnswerSchema.pre('save', function (next) {
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
// AnswerSchema.post('save', function (Answer) {
//   var update = { $addToSet: { 'Answers': Answer } };
//   if (Answer.isTrashed) {
//     var AnswerIdObj = mongoose.Types.ObjectId(Answer._id);
//     /* + If deleted, all references are also deleted */
//     update = { $pull: { 'Answers': AnswerIdObj } };
//   }

//   if (Answer.workspace) {
//     mongoose.models.Workspace.update({ '_id': Answer.workspace },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

//   if (Answer.submission) {
//     mongoose.models.Submission.update({ '_id': Answer.submission },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

// });

module.exports.Answer = mongoose.model('Answer', AnswerSchema);
