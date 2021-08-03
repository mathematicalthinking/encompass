const mongoose = require('mongoose');
const _ = require('underscore');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var WorkspacePermissionObjectSchema = new Schema({
  user: { type: ObjectId, ref: 'User'},
  section: { type: ObjectId, ref: 'Section' },
  organization: { type: ObjectId, ref: 'Organization' },
  global: {type: String, enum: ['viewOnly', 'editor', 'indirectMentor', 'directMentor', 'approver', 'custom'] },
  submissions: {
    all: { type: Boolean },
    submissionIds: [ {type: ObjectId, ref: 'Submission'} ],
    userOnly: { type: Boolean }
  },
  folders: { type: Number, enum: [0, 1, 2, 3] }, // none, see, add new, modify existing folder structure
  comments: { type: Number, enum: [0, 1, 2, 3, 4] },
  selections: { type: Number, enum: [0, 1, 2, 3, 4] }, // if can delete other selections, can delete other taggings
  feedback: { type: String, enum: ['none', 'authReq', 'preAuth', 'approver'] }
}, {versionKey: false, _id: false});

/**
  * @public
  * @class Workspace
  * @description A workspace is the overarching object in Encompass.
  *              It contains all folders, submissions, selections, &
  *              comments.
  */
var WorkspaceSchema = new Schema({
//== Shared properties (Because Monggose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
  lastViewed: { type: Date },
//====
  name: { type: String, required: true, trim: true },
  owner: { type: ObjectId, ref: 'User' },
  editors: [{type: ObjectId, ref: 'User'}],
  mode: { type: String, enum: ['internet', 'public', 'org', 'private'] },
  folders: [{type: ObjectId, ref: 'Folder'}],
  organization: { type: ObjectId, ref: 'Organization' }, // owner's org
  submissionSet: {
    criteria: Object,
    description: Object, // firstSubmissionDate // lastSubmissionDate
    lastUpdated: Date
  },
  // submissionSetEnc: {
  //   criteria: {
  //     problem: { type: ObjectId, ref: 'Problem'},
  //     section: {type: ObjectId, ref: 'Section'}
  //   },
  //   description: {
  //     firstSubmissionDate: { type: Date },
  //     lastSubmissionDate: { type: Date },
  //     problemTitle: { type: String},
  //     sectionName: { type: String },
  //   },
  //   lastUpdated: {type: Date}
  // },
  submissions: [{type: ObjectId, ref: 'Submission'}],
  responses:   [{type: ObjectId, ref: 'Response'}],
  selections: [{type: ObjectId, ref: 'Selection'}],
  comments: [{type: ObjectId, ref: 'Comment'}],
  taggings: [{type: ObjectId, ref: 'Tagging'}],

  // 0: none, 1: view only, 2: create, 3: edit, 4: delete
  permissions: [ WorkspacePermissionObjectSchema ],
  sourceWorkspace: { type: ObjectId, ref: 'Workspace' },
  linkedAssignment: { type: ObjectId, ref: 'Assignment' },
  doAllowSubmissionUpdates: { type: Boolean, default: true }, // for markup workspaces with a linked assignment
  doOnlyUpdateLastViewed: { type: Boolean, default: false },
  workspaceType: { type: String, enum: ['markup', 'parent', 'response'], default: 'markup'},
  parentWorkspaces: [ {type: ObjectId, ref: 'Workspace'} ],
  childWorkspaces: [{type: ObjectId, ref: 'Workspace'}],
  doAutoUpdateFromChildren: { type: Boolean, default: false }, // for parent workspaces

  /*
    For post save hook use only
  */
  updatedFields: [{ type: String, select: false }],
}, {versionKey: false});

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
WorkspaceSchema.pre('save', function (next) {
  var toObjectId = function(elem, ind, arr) {
    if( !(elem instanceof mongoose.Types.ObjectId) && !_.isUndefined(elem) ) {
      arr[ind] = mongoose.Types.ObjectId(elem);
    }
  };

  /** + Every ID reference in our object is properly typed.
    *   This needs to be done BEFORE any other operation so
    *   that native lookups and updates don't fail.
    */
  try {

    let isNew = this.isNew;
    if (!isNew) {
      this.updatedFields = this.modifiedPaths();
    }

    this.editors.forEach(toObjectId);
    this.folders.forEach(toObjectId);
    this.submissions.forEach(toObjectId);
    this.selections.forEach(toObjectId);
    this.comments.forEach(toObjectId);
    this.responses.forEach(toObjectId);
    this.taggings.forEach(toObjectId);
    next();
  }
  catch(err) {
    next(new Error(err.message));
  }
});

/* Update all submissions in this Workspace after saving (Updates cascade) */
WorkspaceSchema.post('save', function (workspace) {

  let wereUpdatedFields =
    Array.isArray(workspace.updatedFields) &&
    workspace.updatedFields.length > 0;

  mongoose.models.Submission.update({_id: {$in: workspace.submissions}},
    {$addToSet: { 'workspaces': workspace }},
    {'multi': true},
    function (err, affected, results) {
      if (err) { throw new Error(err.message); }
    });

    if (Array.isArray(workspace.permissions)) {
      let collaboratorIds = workspace.permissions.map(obj => obj.user);
      if (collaboratorIds.length > 0) {
        mongoose.models.User.update({_id: {$in: collaboratorIds}}, {
          $addToSet: { collabWorkspaces: workspace._id }
        }, {multi: true}, (err, affected, results) => {
          if (err) {throw new Error(err.message);}
        });
      }
    }
    let didLinkedAssignmentChange =
      wereUpdatedFields && workspace.updatedFields.includes('linkedAssignment');

    if (workspace.linkedAssignment) {
      let isParent = workspace.workspaceType === 'parent';

      let updateHash = isParent ?
        { $set: { parentWorkspace: workspace._id } } :
        { $addToSet: { linkedWorkspaces: workspace._id } };

      if (workspace.isTrashed) {
        updateHash = isParent ?
          { $set: { parentWorkspace: null } } :
          { $pull: { linkedWorkspaces: workspace._id } };
      }
      mongoose.models.Assignment.findByIdAndUpdate(
        workspace.linkedAssignment,
        updateHash,
        function(err, affected, result) {
          if (err) {
            throw new Error(err.message);
          }
        }
      );
    }
    let wasLinkedAssignmentRemoved =
      didLinkedAssignmentChange && !workspace.linkedAssignment;
    if (wasLinkedAssignmentRemoved) {
      // remove workspace from assignment's linked workspaces array
      let assignmentFilter = { linkedWorkspaces: workspace._id };
      let assignmentUpdate = { $pull: { linkedWorkspaces: workspace._id } };

      mongoose.models.Assignment.updateMany(
        assignmentFilter,
        assignmentUpdate
      ).catch(err => {
        console.log('Error removing workspace from assignments: ', err);
      });
    }

    let { childWorkspaces } = workspace;
    let hasChildWorkspaces =
      Array.isArray(childWorkspaces) && childWorkspaces.length > 0;

    if (hasChildWorkspaces) {
      // add or remove this workspace from any child workspace's parentWorkspaces array
      let update = workspace.isTrashed ?
        { $pull: { parentWorkspaces: workspace._id } } :
        { $addToSet: { parentWorkspaces: workspace._id } };

      let filter = { _id: { $in: childWorkspaces } };
      mongoose.models.Workspace.updateMany(filter, update).catch(err => {
        console.log('Error updating parent workspace child workspaces: ', err);
      });
    } else {
      let didChildWorkspacesChange = workspace.updatedFields.includes(
        'childWorkspaces'
      );
      // this means that one or more child workspaces were removed
      // and now there are no child workspaces
      // remove this workspace from any workspace that has it in its parent workspace array
      if (didChildWorkspacesChange) {
        let filter = { parentWorkspaces: workspace._id };
        let update = { $pull: { parentWorkspaces: workspace._id } };
        mongoose.models.Workspace.updateMany(filter, update).catch(err => {
          console.log(
            'Error removing parent workspace reference from child workspace: ',
            err
          );
        });
      }
    }
});

module.exports.Workspace = mongoose.model('Workspace', WorkspaceSchema);
module.exports.WorkspacePermissionObject = WorkspacePermissionObjectSchema;

