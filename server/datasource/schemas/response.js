const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('underscore');
const ObjectId = Schema.ObjectId;

const models = require('../schemas');

const { isValidMongoId } = require('../../utils/mongoose');

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
    isNewlyApproved: { type: Boolean, default: false },
    isNewApproved: { type: Boolean, default : false },
    isNewPending: { type: Boolean, default: false },
    isNewlyNeedsRevisions: { type: Boolean, default: false },
    isNewlySuperceded: { type: Boolean, default: false},
    powsRecipient: { type: String },
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

    // if status is approved, send ntf to recipient
    let isNew = this.isNew;
    let modifiedFields = this.modifiedPaths();

    let didStatusChange = modifiedFields.includes('status');

    let isNewApproved = this.isNew && this.responseType === 'mentor' && this.status === 'approved';
    let isNewPending = this.isNew && this.status === 'pendingApproval';

    // for when a draft is saved
    let statusChangedToPending = this.status === 'pendingApproval' && didStatusChange;

    let isNewlyNeedsRevisions = !isNew && this.status === 'needsRevisions' && didStatusChange;

    let isNewlyApproved = !isNew && this.status === 'approved' && didStatusChange;

    let isNewlySuperceded = !isNew && this.status === 'superceded' && didStatusChange;
    // send ntf to recipient after save
    this.isNewApproved = isNewApproved;
    this.isNewlyApproved = isNewlyApproved;
    this.isNewPending = isNewPending || statusChangedToPending;
    this.isNewlyNeedsRevisions = isNewlyNeedsRevisions;
    this.isNewlySuperceded = isNewlySuperceded;

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

  if (response.recipient) {
    if (this.isNewApproved || this.isNewlyApproved) {
      // send ntf to recipient
      let responseType = response.responseType;
      let ntfType;
      let text = '';
      if (responseType === 'mentor') {
        ntfType = 'newMentorReply';
        text = 'You have received a new mentor reply.';
      } else if (responseType === 'approver') {
        ntfType = 'newApproverReply';
        text = 'You have received a new reply from a feedback approver.';
      }

      let newReplyNtf = new models.Notification({
        createdBy: response.createdBy,
        recipient: response.recipient,
        response: response._id,
        primaryRecordType: 'response',
        notificationType: ntfType,
        text
      });

      newReplyNtf.save();

      if (response.isNewlyApproved) {
        // send ntf to creator
        let newlyApprovedNtf = new models.Notification({
          createdBy: response.approvedBy,
          recipient: response.createdBy,
          response: response._id,
          primaryRecordType: 'response',
          notificationType: 'newlyApprovedReply',
          text: 'One of your mentor replies was recently approved.'
        });
        newlyApprovedNtf.save();

        //clear old waiting for approval ntfs
        models.Notification.find({
          notificationType: 'mentorReplyRequiresApproval',
          response: response._id,
          wasSeen: false,
          isTrashed: false
        }).exec()
          .then((ntfs) => {
            ntfs.forEach((ntf) => {
              ntf.wasSeen = true;
              ntf.save();
            });
          });
      }
    }
  }

  if (response.isNewPending) {
    // send ntf to owner of workspace and any approvers
    return models.Workspace.findById(response.workspace).lean().exec()
      .then((workspace) => {
        if (!workspace) {
          return null;
        }
        let ntfRecipients = [];
        if (isValidMongoId(workspace.owner)) {
          ntfRecipients.push(workspace.owner);
        }
        let permissions = workspace.permissions || [];

        permissions.forEach((obj) => {
          if (obj.user && obj.feedback === 'approver') {
            ntfRecipients.push(obj.user);
          }
        });
        ntfRecipients.forEach((userId) => {
          let ntf = new models.Notification({
            createdBy: response.createdBy,
            recipient: userId,
            response: response._id,
            primaryRecordType: 'response',
            notificationType: 'mentorReplyRequiresApproval',
            text: 'There is a new mentor reply waiting to be approved.'
          });
          ntf.save();
        });
      });
  }
  if (response.isNewlyNeedsRevisions) {
    // send ntf to creator of response
    if (isValidMongoId(response.createdBy)) {
      let ntf = new models.Notification({
        recipient: response.createdBy,
        response: response._id,
        primaryRecordType: 'response',
        notificationType: 'mentorReplyNeedsRevisions',
        text: 'One of your mentor replies needs revisions.'
      });
      ntf.save();
    }
  }

  if (response.isNewlySuperceded) {
    // clear any notification relevant to this response
    models.Notification.find({
      primaryRecordType: 'response',
      response: response._id,
      wasSeen: false,
      isTrashed: false
    }).exec()
      .then((ntfs) => {
        ntfs.forEach((ntf) => {
          ntf.wasSeen = true;
          ntf.save();
        });
      });
  }

});

module.exports.Response = mongoose.model('Response', ResponseSchema);
