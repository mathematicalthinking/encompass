var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require('underscore'),
  ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Section
  * @description Sections belong to a school and can contain many students, teachers, and problems
  */
var SectionSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User' },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  //====
  name: { type: String },
  schoolId: { type: String },
  sectionId: { type: Number },
  teachers: [{ type: ObjectId, ref: 'User' }],
  students: [{ type: String }],
  problems: [{ type: ObjectId, ref: 'Problem' }],
}, { versionKey: false });

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
SectionSchema.pre('save', function (next) {
  var toObjectId = function (elem, ind, arr) {
    if (!(elem instanceof mongoose.Types.ObjectId) && !_.isUndefined(elem)) {
      arr[ind] = mongoose.Types.ObjectId(elem);
    }
  };

  /** + Every ID reference in our object is properly typed. 
    *   This needs to be done BEFORE any other operation so
    *   that native lookups and updates don't fail.
    */
  try {
    this.teachers.forEach(toObjectId);
    this.problems.forEach(toObjectId);
    next();
  }
  catch (err) {
    next(new Error(err.message));
  }
});

// /**
//   * ## Post-Validation
//   * After saving we must ensure (synchonously) that:
//   */
// SectionSchema.post('save', function (Section) {
//   var update = { $addToSet: { 'Sections': Section } };
//   if (Section.isTrashed) {
//     var SectionIdObj = mongoose.Types.ObjectId(Section._id);
//     /* + If deleted, all references are also deleted */
//     update = { $pull: { 'Sections': SectionIdObj } };
//   }

//   if (Section.workspace) {
//     mongoose.models.Workspace.update({ '_id': Section.workspace },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

//   if (Section.submission) {
//     mongoose.models.Submission.update({ '_id': Section.submission },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

// });

module.exports.Section = mongoose.model('Section', SectionSchema);
