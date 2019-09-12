/* eslint-disable complexity */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('underscore');
const ObjectId = Schema.ObjectId;

const models = require('../schemas');
const sockets = require('../../socketInit');

const { isValidMongoId } = require('../../utils/mongoose');

const { resolveParentUpdates } = require('../api/parentWorkspaceApi');

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
    selections: [{type: ObjectId, ref:'Selection'}],
    comments: [{type: ObjectId, ref:'Comment'}],
    workspace: {type:ObjectId, ref:'Workspace'},
    submission: {type:ObjectId, ref:'Submission'},
    responseType: {type: String, enum: ['mentor', 'approver', 'student', 'note', 'newRevisionNotice']},
    status: { type: String, enum: ['approved', 'pendingApproval', 'needsRevisions', 'superceded', 'draft'] },
    priorRevision : {type: ObjectId, ref: 'Response'}, // previous mentor reply if responding to an approver reply
    reviewedResponse: {type: ObjectId, ref: 'Response'}, // mentor reply that was source of approver reply
    note: {type: String },
    approvedBy: { type: ObjectId, ref: 'User' },
    unapprovedBy: { type: ObjectId, ref: 'User' },
    powsRecipient: { type: String },
    originalResponse: { type: ObjectId, ref: 'Response' }, // when response is in a parent workspace to ref original
    wasReadByRecipient: { type: Boolean, default: false },
    wasReadByApprover: { type: Boolean, default: false },
    isApproverNoteOnly: { type: Boolean, default: false },

    /*
    For post save hook use only
    */
   isNewlyApproved: { type: Boolean, default: false, select: false },
   isNewApproved: { type: Boolean, default : false, select: false },
   isNewPending: { type: Boolean, default: false, select: false },
   isNewlyNeedsRevisions: { type: Boolean, default: false, select: false },
   isNewlySuperceded: { type: Boolean, default: false, select: false},
   isNewlyRead: { type: Boolean, default: false, select: false},
   wasUnapproved: {type: Boolean, default: false, select: false},
   wasNew: { type: Boolean, default: false, select: false },
   updatedFields: [ { type: String , select: false } ],

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
    this.wasNew = isNew;

    let modifiedFields = this.modifiedPaths();

    if (!this.wasNew) {
      this.updatedFields = modifiedFields;
    }
    let isApproved = this.status === 'approved';

    if (isApproved && isValidMongoId(this.unapprovedBy)) {
      this.unapprovedBy = null;
    }
    let didStatusChange = modifiedFields.includes('status');

    let isNewlyRead = !isNew && (modifiedFields.includes('wasReadByRecipient') && this.wasReadByRecipient);
    let isNewApproved = this.isNew && isApproved;
    let isNewPending = this.isNew && this.status === 'pendingApproval';

    // for when a draft is saved
    let statusChangedToPending = this.status === 'pendingApproval' && didStatusChange;

    let isNewlyNeedsRevisions = !isNew && this.status === 'needsRevisions' && didStatusChange;

    let wasApproved = isValidMongoId(this.approvedBy);

    // not newly approved if user saved one of their drafts
    let isNewlyApproved = !isNew && (isApproved && didStatusChange && wasApproved);

    let isNewlySuperceded = !isNew && this.status === 'superceded' && didStatusChange;

    // when a response is unapproved, approvedBy is set to null && unapprovedBy is set
    let didUnapprovedByChange = modifiedFields.includes('unapprovedBy');
    let wasUnapproved = didUnapprovedByChange && isValidMongoId(this.unapprovedBy) && didStatusChange && !isApproved;

    // send ntf to recipient after save
    this.isNewApproved = isNewApproved;
    this.isNewlyApproved = isNewlyApproved;
    this.isNewPending = isNewPending || ( statusChangedToPending && !wasUnapproved);
    this.isNewlyNeedsRevisions = isNewlyNeedsRevisions;
    this.isNewlySuperceded = isNewlySuperceded;
    this.isNewlyRead = isNewlyRead;
    this.wasUnapproved = wasUnapproved;

    next();
  }
  catch(err) {
    next(new Error(err.message));
  }
});

// emit event to creator of response and approvedBy if exits
async function emitResponseReadEvent(response) {
  if (!response) {
    return;
  }

  let userIds = [];

  if (isValidMongoId(response.createdBy)) {
      userIds.push(response.createdBy);
  }

  if (isValidMongoId(response.approvedBy)) {
    userIds.push(response.approvedBy);
  }

  if (userIds.length === 0) {
    return;
  }

  let users = await models.User.find({_id: {$in: userIds}, isTrashed: false}, {socketId: 1}).lean().exec();

  users.forEach((user) => {
    let socketId = user.socketId;

    if (socketId) {
      let socket = _.propertyOf(sockets)(['io', 'sockets', 'sockets', socketId]);

      if (socket) {
        let data = {
          updatedRecord: response,
          recordType: 'response'
        };
        socket.emit('UPDATED_RECORD', data);
      }
    }
  });

}

/**
  * ## Post-Validation
  * After saving we must ensure (synchonously) that:
  */
ResponseSchema.post('save', function (response) {
  var update = { $addToSet: { 'responses': response } };
  let isParentResponse = isValidMongoId(response.originalResponse);

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
  // do not send ntfs if parent response

  if (!isParentResponse) {
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
  }

  // update status of response being read to creator and approvedBy (if exists)
  if (response.isNewlyRead) {
    emitResponseReadEvent(response);
  }

  if (response.isNewlySuperceded || response.isTrashed || response.wasUnapproved) {
    // clear any notification relevant to this response
    models.Notification.find({
      primaryRecordType: 'response',
      response: response._id,
      wasSeen: false,
      isTrashed: false
    }).exec()
      .then((ntfs) => {
        ntfs.forEach((ntf) => {
          ntf.isTrashed = true;
          ntf.save();
        });
      });

      if (response.wasUnapproved) {
        // emit CLEAR_RECORD event to recipient
        models.User.findById(response.recipient).exec()
          .then((recipient) => {
            if (recipient) {
              let socketId = recipient.socketId;
              if (socketId) {
                let socket = _.propertyOf(sockets)(['io', 'sockets', 'sockets', socketId]);
                if (socket) {

                  let data = {
                    recordIdToClear: response._id,
                    recordType: 'response'
                  };
                  socket.emit('CLEAR_RECORD', data);
                }
              }
            }

          });

          // emit UPDATED_RECORD event to creator of response
          models.User.findById(response.createdBy).exec()
            .then((creator) => {
              if (creator) {
                let socketId = creator.socketId;
                if (socketId) {
                  let socket = _.propertyOf(sockets)(['io', 'sockets', 'sockets', socketId]);
                  if (socket) {
                    let data = {
                      updatedRecord: response,
                      recordType: 'response'
                    };
                    socket.emit('UPDATED_RECORD', data);
                  }
                }
              }

            });
      }
  }

  let { updatedFields, wasNew } = response;

  let wereUpdatedFields =
    Array.isArray(updatedFields) && updatedFields.length > 0;

  if (wasNew) {
    return resolveParentUpdates(
      response.createdBy,
      response,
      'response',
      'create'
    ).catch(err => {
      console.log('error creating new parent response: ', err);
    });
  } else if (wereUpdatedFields) {
    let allowedParentUpdateFields = [
      'isTrashed',
      'status',
      'text',
      'note',
      'approvedBy',
      'unapprovedBy',
      'wasReadByRecipient',
      'wasReadByApprover',
      'reviewedResponse',
      'priorRevision'
    ];

    let parentFieldsToUpdate = updatedFields.filter(field => {
      return allowedParentUpdateFields.includes(field);
    });

    if (parentFieldsToUpdate.length === 0) {
      return;
    }

    resolveParentUpdates(
      response.lastModifiedBy,
      response,
      'response',
      'update',
      parentFieldsToUpdate
    ).catch(err => {
      console.log('err resolving parent response update', err);
    });
  }

});

module.exports.Response = mongoose.model('Response', ResponseSchema);
