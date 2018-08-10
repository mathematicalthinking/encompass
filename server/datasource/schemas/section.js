var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require('underscore'),
  ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Section
  * @description Sections belong to a teacher/school/admin and can contain many students, teachers, and problems
  * @todo Need to decide on what info should be saved, as well as who is the owner of the section
  */
var SectionSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User' },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  //====
  name: { type: String },
  organization: { type: ObjectId, ref: 'Organization' },
  sectionId: { type: Number },
  sectionPassword: { type: String },
  teachers: [{ type: ObjectId, ref: 'User' }],
  students: [{ type: ObjectId, ref: 'User' }],
  problems: [{ type: ObjectId, ref: 'Problem' }],
  assignments: [{type: ObjectId, ref: 'Assignment'}]
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
SectionSchema.post('save', function (Section) {
  console.log('section post', Section);
  var update = { $addToSet: { 'sections': { sectionId: Section, role: 'teacher'} } };
  if (Section.isTrashed) {
    var SectionIdObj = mongoose.Types.ObjectId(Section._id);
    /* + If deleted, all references are also deleted */
    update = { $pull: { 'sections': {sectionId: SectionIdObj, role: 'teacher'} } };
  }

  // if (Section.createdBy) {
  //   mongoose.models.User.update({ '_id': Section.createdBy },
  //     update,
  //     function (err, affected, result) {
  //       if (err) {
  //         throw new Error(err.message);
  //       }
  //     });
  // }

  if (Section.teachers) {
    mongoose.models.User.update({ '_id': {$in: Section.teachers }},
      update,
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
      });
  }

});

module.exports.Section = mongoose.model('Section', SectionSchema);
