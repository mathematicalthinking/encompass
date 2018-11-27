const mongoose = require('mongoose');
const _ = require('underscore');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

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
  name: { type: String, required: true },
  owner: { type: ObjectId, ref: 'User' },
  editors: [{type: ObjectId, ref: 'User'}],
  mode: { type: String, enum: ['internet', 'public', 'org', 'private'] },
  folders: [{type: ObjectId, ref: 'Folder'}],
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
  permissions: [ {
    user: { type: ObjectId, ref: 'User'},
    global: {type: String, enum: ['viewOnly', 'editor', 'custom'] },
    answers: { type: String, enum: ['all', 'user'] },
    folders: { type: Number, enum: [0, 1, 2, 3, 4] },
    comments: { type: Number, enum: [0, 1, 2, 3, 4] },
    selections: { type: Number, enum: [0, 1, 2, 3, 4] },
    feedback: { type: String, enum: ['none', 'authReq', 'preAuth'] }

  }],
  feedbackAuthorizers: [ {type: ObjectId, ref: 'User'}]
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
          console.log('updated user collab workspaces', affected, results);
        });
      }
    }
});

module.exports.Workspace = mongoose.model('Workspace', WorkspaceSchema);

