var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Folder = require('./folder'),
    Tagging = require('./tagging'),
    Submission = require('./submission'),
    Selection = require('./selection');

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
//====
    name: {type:String, required:true},
    owner: {type:ObjectId, ref:'User'},
    editors: [{type:ObjectId, ref:'User'}],
    mode: {type: String},
    folders: [{type:ObjectId, ref:'Folder'}],
    submissionSet: {
      criteria: Object,
      description: Object,
      lastUpdated: Date
    },
    submissions: [{type:ObjectId, ref:'Submission'}],
    responses:   [{type:ObjectId, ref:'Response'}],
    selections: [{type:ObjectId, ref:'Selection'}],
    comments: [{type:ObjectId, ref:'Comment'}],
    taggings: [{type:ObjectId, ref:'Tagging'}]
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
});

module.exports.Workspace = mongoose.model('Workspace', WorkspaceSchema);

