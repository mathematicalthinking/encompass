const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('underscore');
const ObjectId = Schema.ObjectId;

const { isNonEmptyArray} = require('../../utils/objects');

/**
  * @public
  * @class Assignment
  * @description Assignments are submitted by teachers, we allow image uploads
  * @todo Allow images to be used as supplment or entire assignment?
  */
var AssignmentSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
  //====
  name: { type: String, trim: true },
  problem: { type: ObjectId, ref: 'Problem' },
  taskWorkspace: { type: ObjectId, ref: 'Workspace' }, // for type workspace assignments
  students: [{ type: ObjectId, ref: 'User' }],
  section: { type: ObjectId, ref: 'Section' },
  assignedDate: { type: Date },
  answers: [{ type: ObjectId, ref: 'Answer'}],
  dueDate: { type: Date },
  assignmentType: { type: String },
  linkedWorkspaces: [{ type: ObjectId, ref: 'Workspace' }], // for auto updatingtype problem assignments
  parentWorkspace: { type: ObjectId, ref: 'Workspace' },
  linkedWorkspacesRequest: {
    doCreate: { type: Boolean, default: false },
    error: { type: String },
    createdWorkspaces: [{ type: ObjectId, ref: 'Workspace' }],
    doAllowSubmissionUpdates: { type: Boolean, default: true},
    name: { type: String },
    createDate: {type: Date }
  },
  parentWorkspaceRequest: {
    doCreate: { type: Boolean, default: false },
    error: { type: String },
    createdWorkspace: { type: ObjectId, ref: 'Workspace' },
    childWorkspaces: [ {type: ObjectId, ref: 'Workspace'}],
    doAutoUpdateFromChildren: { type: Boolean, default: true},
    name: { type: String },
    createDate:  {type: Date }
  }
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
  var update = { $addToSet: { 'assignments':  assignment._id }};
  if (assignment.isTrashed) {
    var assignmentIdObj = mongoose.Types.ObjectId(assignment._id);
    /* + If deleted, all references are also deleted */
    update = { $pull: { 'assignments': assignmentIdObj }};
  }

  if (assignment.students) {
    mongoose.models.User.update({ '_id': {$in: assignment.students }},
      update, {multi: true},
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
        if (assignment.isTrashed) {
          console.log(`removed assignment from students: `, affected);
        } else {
          console.log(`added assignment to students: `, affected);
        }
      });
  }

    if (assignment.section) {
      mongoose.models.Section.update({'_id': assignment.section},
        update,
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
      });
    }

    if (isNonEmptyArray(assignment.linkedWorkspaces)) {
      let updateHash = { $set: {linkedAssignment: assignment._id} };

      if (assignment.isTrashed) {
        updateHash = { $set: {linkedAssignment: undefined } };
      }

      mongoose.models.Workspace.updateMany({_id: {$in: assignment.linkedWorkspaces } }, updateHash, function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
      });
    }
});

module.exports.Assignment = mongoose.model('Assignment', AssignmentSchema);
