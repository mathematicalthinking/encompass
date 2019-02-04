const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('underscore');

const ObjectId = Schema.ObjectId;

const  { User } = require('../schemas');

const { isValidMongoId } = require('../../utils/mongoose');

/**
  * @public
  * @class Notification
  */
var NotificationSchema = new Schema({
//== Shared properties (Because Mongoose doesn't support schema inheritance)
    createdBy: { type: ObjectId, ref: 'User', required: true },
    createDate: { type: Date, 'default': Date.now() },
    isTrashed: { type: Boolean, 'default': false },
    lastModifiedBy: { type: ObjectId, ref: 'User' },
    lastModifiedDate: { type: Date, 'default': Date.now() },
//====
    text: { type: String, },
    primaryRecordType: { type: String, enum: ['workspace', 'assignment', 'section', 'response', 'problem', 'organization']},
    notificationType: {type: String, enum: ['newWorkToMentor', 'mentorReplyNeedsRevisions', 'newAssignmentAnswer', 'newMentorReply', 'mentorReplyRequiresApproval', 'newApproverReply']},
    newSubmission: { type: ObjectId, ref: 'Submission' },
    oldSubmission: {type: ObjectId, ref: 'Submission'},
    workspace: {type: ObjectId, ref: 'Workspace' },
    response: {type: ObjectId , ref: 'Response' },
    recipient: {type: ObjectId, ref: 'User'},
    wasSeen: {type: Boolean, default: false},
    doAddToRecipient: { type: Boolean }, // only used for post save hook,
    doPullFromRecipient: { type: Boolean } // only used for post save hook,
  }, {versionKey: false});

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
NotificationSchema.pre('save', function (next) {
  // new notification, add to user's ntf array
  if (this.isNew) {
    this.doAddToRecipient = true;
    next();
  }
  let modifiedFields = this.modifiedPaths();

  if (this.isTrashed) {
    if (modifiedFields.includes('isTrashed')) {
      this.doPullFromRecipient = true;
      next();
    }
  }

  if (this.wasSeen) {
    if (modifiedFields.includes('wasSeen')) {
      // notification was set from seen to unseen, pull from user
      this.doPullFromRecipient = true;
      next();
    }
  }

  if (!this.wasSeen) {
    // notification was manually toggled to 'unread', so add back to user
    if (modifiedFields.includes('wasSeen')) {
      this.doAddToRecipient = true;
      next();
    }
  }
  next();
});

/**
  * ## Post-Validation
  * After saving we must ensure (synchonously) that:
  */
NotificationSchema.post('save', function (notification) {
  console.log('should add to recip?', notification.doAddToRecipient);
  console.log('should pull from recip?', notification.doPullFromRecipient);


  if (notification.doAddToRecipient) {
    // add to recipient's notifications array
    if (isValidMongoId(notification.recipient)) {
      User.findByIdAndUpdate(notification.recipient, {
        $addToSet: { notifications: notification._id }
      }).exec();
    }
  }

  if (notification.doPullFromRecipient) {
    if (isValidMongoId(notification.recipient)) {
      User.findByIdAndUpdate(notification.recipient, {
        $pull: { notifications: notification._id }
      }).exec();
    }
  }
});

module.exports.Notification = mongoose.model('Notification', NotificationSchema);
