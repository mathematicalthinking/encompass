const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const WorkspacePermissionObject = require('./workspace').WorkspacePermissionObject;

/**
  * @public
  * @class CopyWorkspaceRequest
  * @description CopyWorkspaceRequests are a student's response to a problem
  */
var CopyWorkspaceRequestSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
  //====
  originalWsId: { type: ObjectId, ref: 'Workspace' },
  owner: { type: ObjectId, ref: 'User' },
  name: { type: String },
  mode: { type: String, enum: ['private', 'org', 'public', 'internet']},
  submissionOptions: {
    all: { type: Boolean },
    none: { type: Boolean },
    submissionIds: [{ type: ObjectId, ref: 'Answer' }]
  },
  folderOptions: {
    includeStructureOnly: { type: Boolean },
    folderSetOptions: {
      doCreateFolderSet: { type: Boolean },
      existingFolderSetToUse: {type: ObjectId, ref: 'FolderSet'},
      name: { type: String, trim: true },
      privacySetting: { type: String, enum: ['M', 'O', 'E'] }
    },
    all: { type: Boolean },
    none: { type: Boolean },
  },
  selectionOptions: {
    all: { type: Boolean },
    none: { type: Boolean },
    selectionIds: [{ type: ObjectId, ref: 'Selection' }]
  },
  commentOptions: {
    all: { type: Boolean },
    none: { type: Boolean },
    commentIds: [{ type: ObjectId, ref: 'Comment' }]
  },
  responseOptions: {
    all: Boolean,
    none: Boolean,
    responseIds: [{ type: ObjectId, ref: 'Response' }]
  },
  permissionOptions: {
    // doUseOriginal: { type: Boolean },
    permissionObjects: [ WorkspacePermissionObject ]
  },
  createdWorkspace: { type: ObjectId, ref: 'Workspace' },
  createdFolderSet: { type: ObjectId, ref: 'FolderSet' },
  copyWorkspaceError: { type: String },
}, { versionKey: false });

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
// CopyWorkspaceRequestSchema.pre('save', function (next) {
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
// CopyWorkspaceRequestSchema.post('save', function (CopyWorkspaceRequest) {
//   var update = { $addToSet: { 'answers': CopyWorkspaceRequest } };
//   if (CopyWorkspaceRequest.isTrashed) {
//     var CopyWorkspaceRequestIdObj = mongoose.Types.ObjectId(CopyWorkspaceRequest._id);
//     /* + If deleted, all references are also deleted */
//     update = { $pull: { 'CopyWorkspaceRequests': CopyWorkspaceRequestIdObj } };
//   }

//   if (CopyWorkspaceRequest.createdBy) {
//     console.log('in post answer hook');
//     var userIdObj = mongoose.Types.ObjectId(CopyWorkspaceRequest.createdBy);
//     mongoose.models.User.update({ '_id': userIdObj },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//         console.log('affected users', affected);
//       });
//   }

//   if (CopyWorkspaceRequest.assignment) {
//     var assignmentIdObj = mongoose.Types.ObjectId(CopyWorkspaceRequest.assignment);
//     mongoose.models.Assignment.update({ '_id': assignmentIdObj },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//         console.log('affected assignments', affected);
//       });
//   }

//   if (CopyWorkspaceRequest.problem) {
//     var problemIdObj = mongoose.Types.ObjectId(CopyWorkspaceRequest.problem);
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

module.exports.CopyWorkspaceRequest = mongoose.model('CopyWorkspaceRequest', CopyWorkspaceRequestSchema);
