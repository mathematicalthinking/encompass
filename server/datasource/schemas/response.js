const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('underscore');
const ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Response
  * @description Responses are text documents based on selections and comments
  */
var ResponseSchema = new Schema({
//== Shared properties (Because Mongoose doesn't support schema inheritance)
    createdBy: { type: ObjectId, ref: 'User', required: true },
    createDate: { type: Date, 'default': Date.now() },
    isTrashed: { type: Boolean, 'default': false },
    lastModifiedBy: { type: ObjectId, ref: 'User' },
    lastModifiedDate: { type: Date, 'default': Date.now() },
//====
    text: { type: String, required: true },
    source: { type: String, required: true }, // submission, workspace, etc - what triggered this?
    original: { type: String },
    recipient: { type: ObjectId, ref: 'User' },
    selections: [{type: ObjectId, ref:'Selections'}],
    comments: [{type: ObjectId, ref:'Comments'}],
    workspace: {type:ObjectId, ref:'Workspace'},
    submission: {type:ObjectId, ref:'Submission'},
    responseType: {type: String, enum: ['mentor', 'approver', 'student', 'note', 'newRevisionNotice']},
    status: { type: String, enum: ['approved', 'pendingApproval', 'needsRevisions', 'superceded', 'draft'] },
    priorRevision : {type: ObjectId, ref: 'Response'}, // previous mentor reply if responding to an approver reply
    reviewedResponse: {type: ObjectId, ref: 'Response'}, // mentor reply that was source of approver reply
    note: {type: String },
    approvedBy: { type: ObjectId, ref: 'User' },
    wasReadByRecipient: { type: Boolean, default: false },
    wasReadByApprover: { type: Boolean, default: false },
    isApproverNoteOnly: { type: Boolean, default: false },
  }, {versionKey: false});

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
ResponseSchema.pre('save', function (next) {
  var toObjectId = function(elem, ind, arr) {
    if( !(elem instanceof mongoose.Types.ObjectId) && !_.isUndefined(elem)) {
      arr[ind] = mongoose.Types.ObjectId(elem);
    }
  };

  /** + Every ID reference in our object is properly typed.
    *   This needs to be done BEFORE any other operation so
    *   that native lookups and updates don't fail.
    */
  try {
    this.selections.forEach(toObjectId);
    this.comments.forEach(toObjectId);
    next();
  }
  catch(err) {
    next(new Error(err.message));
  }
});

/**
  * ## Post-Validation
  * After saving we must ensure (synchonously) that:
  */
ResponseSchema.post('save', function (response) {
  var update = { $addToSet: { 'responses': response } };
  if( response.isTrashed ) {
    var responseIdObj = mongoose.Types.ObjectId( response._id );
    /* + If deleted, all references are also deleted */
    update = { $pull: { 'responses': responseIdObj } };
  }

  if(response.workspace){
    mongoose.models.Workspace.update({'_id': response.workspace},
      update,
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
      });
  }

  if(response.submission){
    mongoose.models.Submission.update({'_id': response.submission},
      update,
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
      });
  }

});

module.exports.Response = mongoose.model('Response', ResponseSchema);
