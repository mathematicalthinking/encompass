var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require('underscore'),
  ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Assignment
  * @description Assignments are submitted by teachers, we allow image uploads
  * @todo Allow images to be used as supplment or entire assignment?
  */
var AssignmentSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User' },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  //====
  problem: { type: ObjectId, ref: 'Problem' },
  student: { type: ObjectId, ref: 'User' },
  section: { type: ObjectId, ref: 'Section' },
  assignedDate: { type: Date },
  answers: [{ type: ObjectId, ref: 'Answer'}],
  dueDate: { type: Date },
}, { versionKey: false });

/* + The Problem exists */
AssignmentSchema.pre('save', true, function (next, done) {
  mongoose.models.Problem.findById(this.problem)
    .lean()
    .exec(function (err, found) {
      if (err) { next(new Error(err.message)); }
      else {
        next();
      }
      done();
    });
});

/* + The Student exists */
AssignmentSchema.pre('save', true, function (next, done) {
  mongoose.models.User.findById(this.user)
    .lean()
    .exec(function (err, found) {
      if (err) { next(new Error(err.message)); }
      else {
        next();
      }
      done();
    });
});

/* + The Section exists */
AssignmentSchema.pre('save', true, function (next, done) {
  mongoose.models.Section.findById(this.section)
    .lean()
    .exec(function (err, found) {
      if (err) { next(new Error(err.message)); }
      else {
        next();
      }
      done();
    });
});

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
AssignmentSchema.pre('save', function (next) {
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
    this.answers.forEach(toObjectId);
    next();
  }
  catch (err) {
    next(new Error(err.message));
  }
});

/**
  * ## Post-Validation
  * After saving we must ensure (synchonously) that:
  */
AssignmentSchema.post('save', function (Assignment) {
  var update = { $addToSet: { 'Assignments': Assignment } };
  if (Assignment.isTrashed) {
    var AssignmentIdObj = mongoose.Types.ObjectId(Assignment._id);
    /* + If deleted, all references are also deleted */
    update = { $pull: { 'Assignments': AssignmentIdObj } };
  }

  if (Assignment.student) {
    mongoose.models.User.update({ '_id': Assignment.student },
      update,
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
      });
  }
});

module.exports.Assignment = mongoose.model('Assignment', AssignmentSchema);
