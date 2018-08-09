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
  students: [{ type: ObjectId, ref: 'User' }],
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
    this.students.forEach(toObjectId);
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

AssignmentSchema.post('save', function (assignment) {
  console.log('in post hook assignment');
  if (assignment.isTrashed) {
    var assignmentIdObj = mongoose.Types.ObjectId( assignment._id );

    mongoose.models.User.update({'assignments': assignment.students},
      {$pull: {"assignments": assignmentIdObj}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
    });
  }



  mongoose.models.User.update({_id: {$in: assignment.students}},
    {$addToSet: { 'assignments': assignment }},
    {'multi': true},
    function (err, affected, results) {
      if (err) { throw new Error(err.message); }
      console.log('affected', affected);
    });
});

module.exports.Assignment = mongoose.model('Assignment', AssignmentSchema);
