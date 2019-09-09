const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
  * @public
  * @class UpdateWorkspaceRequest
  * @description UpdateWorkspaceRequests are a student's response to a problem
  */
var UpdateWorkspaceRequestSchema = new Schema(
  {
    //== Shared properties (Because Mongoose doesn't support schema inheritance)
    createdBy: { type: ObjectId, ref: 'User', required: true },
    createDate: { type: Date, default: Date.now() },
    isTrashed: { type: Boolean, default: false },
    lastModifiedBy: { type: ObjectId, ref: 'User' },
    lastModifiedDate: { type: Date, default: Date.now() },
    //====
    //student: { type: ObjectId, ref: 'User' },
    // studentName: { type: String },
    linkedAssignment: { type: ObjectId, ref: 'Assignment' },
    workspace: { type: ObjectId, ref: 'Workspace' },
    wereNoAnswersToUpdate: { type: Boolean, default: false },
    updateErrors: [{ type: String }],
    addedSubmissions: [{ type: ObjectId, ref: 'Submission' }],
    isParentUpdate: { type: Boolean, default: false },
    wasNoDataToUpdate: { type: Boolean, default: false },
    createdParentData: {
      submissions: [{ type: ObjectId, ref: 'Submission' }],
      selections: [{ type: ObjectId, ref: 'Selection' }],
      comments: [{ type: ObjectId, ref: 'Comment' }],
      responses: [{ type: ObjectId, ref: 'Responses' }],
      folders: [{ type: ObjectId, ref: 'Folder' }],
      taggings: [{ type: ObjectId, ref: 'Tagging'}],
    },
    updatedParentData: {
      submissions: [{
        recordId: { type: ObjectId, ref: 'Submission'},
        updatedFields: [ { type: String } ],
        wasJustTrashed: { type: Boolean, default: false },
        wasJustRestored: { type: Boolean, default: false },
      }],
      selections: [{
        recordId: { type: ObjectId, ref: 'Selection'},
        updatedFields: [ { type: String } ],
        wasJustTrashed: { type: Boolean, default: false },
        wasJustRestored: { type: Boolean, default: false },
      }],
      comments: [{
        recordId: { type: ObjectId, ref: 'Comment'},
        updatedFields: [ { type: String } ],
        wasJustTrashed: { type: Boolean, default: false },
        wasJustRestored: { type: Boolean, default: false },
      }],
      responses: [{
        recordId: { type: ObjectId, ref: 'Response'},
        updatedFields: [ { type: String } ],
        wasJustTrashed: { type: Boolean, default: false },
        wasJustRestored: { type: Boolean, default: false },
      }],
      folders: [{
        recordId: { type: ObjectId, ref: 'Folder'},
        updatedFields: [ { type: String } ],
        wasJustTrashed: { type: Boolean, default: false },
        wasJustRestored: { type: Boolean, default: false },
      }],
      taggings: [{
        recordId: { type: ObjectId, ref: 'Tagging'},
        updatedFields: [ { type: String } ],
        wasJustTrashed: { type: Boolean, default: false },
        wasJustRestored: { type: Boolean, default: false },
      }],

    }

  },
  { versionKey: false }
);

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
// UpdateWorkspaceRequestSchema.pre('save', function (next) {
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
// UpdateWorkspaceRequestSchema.post('save', function (UpdateWorkspaceRequest) {
//   var update = { $addToSet: { 'answers': UpdateWorkspaceRequest } };
//   if (UpdateWorkspaceRequest.isTrashed) {
//     var UpdateWorkspaceRequestIdObj = mongoose.Types.ObjectId(UpdateWorkspaceRequest._id);
//     /* + If deleted, all references are also deleted */
//     update = { $pull: { 'UpdateWorkspaceRequests': UpdateWorkspaceRequestIdObj } };
//   }

//   if (UpdateWorkspaceRequest.createdBy) {
//     console.log('in post answer hook');
//     var userIdObj = mongoose.Types.ObjectId(UpdateWorkspaceRequest.createdBy);
//     mongoose.models.User.update({ '_id': userIdObj },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//         console.log('affected users', affected);
//       });
//   }

//   if (UpdateWorkspaceRequest.assignment) {
//     var assignmentIdObj = mongoose.Types.ObjectId(UpdateWorkspaceRequest.assignment);
//     mongoose.models.Assignment.update({ '_id': assignmentIdObj },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//         console.log('affected assignments', affected);
//       });
//   }

//   if (UpdateWorkspaceRequest.problem) {
//     var problemIdObj = mongoose.Types.ObjectId(UpdateWorkspaceRequest.problem);
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

module.exports.UpdateWorkspaceRequest = mongoose.model('UpdateWorkspaceRequest', UpdateWorkspaceRequestSchema);
