const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const WorkspacePermissionObject = require('./workspace').WorkspacePermissionObject;

/**
  * @public
  * @class VmtImportRequest
  * @description VmtImportRequests are made from the vmt import page
  */
var VmtImportRequestSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
  //====
  workspaceOwner: { type: ObjectId, ref: 'User' },
  workspaceName: { type: String },
  workspaceMode: { type: String, enum: ['private', 'org', 'public', 'internet']},
  doCreateWorkspace: { type: Boolean, },
  folderSet: { type: ObjectId, ref: 'FolderSet' },
  permissionObjects: [ WorkspacePermissionObject ],

  vmtRooms: { type: Object }, // populated vmt Rooms that will be converted to answers and then submissions

  createdWorkspace: { type: ObjectId, ref: 'Workspace' },
  createdAnswers: [{ type: ObjectId, ref: 'Answer'}],
  createdSubmissions: { type: ObjectId, ref: 'Submission' },
  createWorkspaceError: { type: String },
}, { versionKey: false });

module.exports.VmtImportRequest = mongoose.model('VmtImportRequest', VmtImportRequestSchema);
