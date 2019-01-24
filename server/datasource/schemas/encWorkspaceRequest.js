const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const WorkspacePermissionObject = require('./workspace').WorkspacePermissionObject;

/**
  * @public
  * @class EncWorkspaceRequest
  * @description EncWorkspaceRequests are a student's response to a problem
  */
var EncWorkspaceRequestSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
  //====
  //student: { type: ObjectId, ref: 'User' },
  // studentName: { type: String },
  problem: { type: ObjectId, ref: 'Problem' },
  assignment: { type: ObjectId, ref: 'Assignment' },
  answer: { type: String },
  teacher: { type: ObjectId, ref: 'User' },
  startDate: { type: Date },
  endDate: { type: Date },
  pdSetName: { type: String },
  folderSetName: { type: String },
  section: { type: ObjectId, ref: 'Section' },
  createdWorkspace: { type: ObjectId, ref: 'Workspace' },
  isEmptyAnswerSet: { type: Boolean },
  createWorkspaceError: { type: String },
  newAnswerSet: {
    name: {type: String},
    privacySetting: {type: 'String', enum: ['M', 'O', 'E']}
  },
  answers: [{type: ObjectId, ref: 'Answer'}],
  permissionObjects: [ WorkspacePermissionObject ]
}, { versionKey: false });

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
// EncWorkspaceRequestSchema.pre('save', function (next) {
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
// EncWorkspaceRequestSchema.post('save', function (EncWorkspaceRequest) {
//   var update = { $addToSet: { 'answers': EncWorkspaceRequest } };
//   if (EncWorkspaceRequest.isTrashed) {
//     var EncWorkspaceRequestIdObj = mongoose.Types.ObjectId(EncWorkspaceRequest._id);
//     /* + If deleted, all references are also deleted */
//     update = { $pull: { 'EncWorkspaceRequests': EncWorkspaceRequestIdObj } };
//   }

//   if (EncWorkspaceRequest.createdBy) {
//     console.log('in post answer hook');
//     var userIdObj = mongoose.Types.ObjectId(EncWorkspaceRequest.createdBy);
//     mongoose.models.User.update({ '_id': userIdObj },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//         console.log('affected users', affected);
//       });
//   }

//   if (EncWorkspaceRequest.assignment) {
//     var assignmentIdObj = mongoose.Types.ObjectId(EncWorkspaceRequest.assignment);
//     mongoose.models.Assignment.update({ '_id': assignmentIdObj },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//         console.log('affected assignments', affected);
//       });
//   }

//   if (EncWorkspaceRequest.problem) {
//     var problemIdObj = mongoose.Types.ObjectId(EncWorkspaceRequest.problem);
//     mongoose.models.Problem.update({ '_id': problemIdObj },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//         console.log('affected problems', affected);
//       });
//   }

// });

module.exports.EncWorkspaceRequest = mongoose.model('EncWorkspaceRequest', EncWorkspaceRequestSchema);
