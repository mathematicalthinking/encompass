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
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
  //====
  //student: { type: ObjectId, ref: 'User' },
  // studentName: { type: String },
  problem: { type: ObjectId, ref: 'Problem', required: true },
  assignment: { type: ObjectId, ref: 'Assignment' },
  answer: { type: String },
  explanation: { type: String }, //Change to text if we can save image ObjectId
  // explanationImage: { type: ObjectId, ref: 'Image' },
  section: { type: ObjectId, ref: 'Section' },
  students: [{ type: ObjectId, ref: 'User'}],
  uploadedFileId: { type: String },
  imageData: { type: String }, // Remove this is we only save imageId
  priorAnswer: { type: ObjectId, ref: 'Answer' },
  isSubmitted: { type: Boolean, default: true }
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
AnswerSchema.post('save', function (Answer) {
  var update = { $addToSet: { 'answers': Answer } };
  if (Answer.isTrashed) {
    var AnswerIdObj = mongoose.Types.ObjectId(Answer._id);
    /* + If deleted, all references are also deleted */
    update = { $pull: { 'Answers': AnswerIdObj } };
  }

  if (Answer.createdBy) {
    console.log('in post answer hook');
    var userIdObj = mongoose.Types.ObjectId(Answer.createdBy);
    mongoose.models.User.update({ '_id': userIdObj },
      update,
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
        console.log('affected users', affected);
      });
  }

  if (Answer.assignment) {
    var assignmentIdObj = mongoose.Types.ObjectId(Answer.assignment);
    mongoose.models.Assignment.update({ '_id': assignmentIdObj },
      update,
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
        console.log('affected assignments', affected);
      });
  }

  if (Answer.problem) {
    var problemIdObj = mongoose.Types.ObjectId(Answer.problem);
    mongoose.models.Problem.update({ '_id': problemIdObj },
      update,
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
        console.log('affected problems', affected);
      });
  }

});

module.exports.Answer = mongoose.model('Answer', AnswerSchema);
