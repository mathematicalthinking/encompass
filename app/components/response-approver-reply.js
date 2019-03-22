Encompass.ResponseApproverReplyComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'response-approver-reply',
  alert: Ember.inject.service('sweet-alert'),
  utils: Ember.inject.service('utility-methods'),

  showNoPreviousRepliesMsg: Ember.computed.equal('approverReplies.length', 0),
  replyToView: null,
  quillEditorId: 'approver-editor',
  quillText: '',
  maxResponseLength: 14680064,

  errorPropsToRemove: ['saveRecordErrors','emptyReplyError', 'quillTooLongError'],

  statusIconFill: function () {
    let status = this.get('displayReply.status');
    return this.get('iconFillOptions')[status];
  }.property('displayReply.status', 'iconFillOptions'),

  didReceiveAttrs() {
    if (!this.get('approverReplies.length') > 0 ) {
      this.set('replyToView', null);
    }
    let primaryReply = this.get('primaryReply');

    let responseToSet;

    if (primaryReply) {
      responseToSet = primaryReply;
    } else if (this.get('sortedApproverReplies.lastObject')) {
      responseToSet = this.get('sortedApproverReplies.lastObject');
    } else {
      responseToSet = null;
    }
    if (responseToSet) {
      this.handleRecipientRead(responseToSet);
    }

    this.set('replyToView', responseToSet);

    this._super(...arguments);
  },

  handleRecipientRead(response) {
    let recipId = this.get('utils').getBelongsToId(response, 'recipient');
    if (recipId === this.get('currentUser.id') && !response.get('wasReadByRecipient')) {
        response.set('wasReadByRecipient', true);
        response.save();
    }
  },

  displayReply: function() {
    if (this.get('replyToView')) {
      return this.get('replyToView');
    }

    return this.get('sortedApproverReplies.lastObject') || null;
  }.property('replyToView', 'sortedApproverReplies.[]'),

  isDraft: function() {
    return this.get('displayReply.status') === 'draft';
  }.property('displayReply.status'),

  sortedApproverReplies: function() {
    if (!this.get('approverReplies')) {
      return [];
    }
    return this.get('approverReplies')
      .rejectBy('isTrashed')
      .sortBy('createDate');
  }.property('approverReplies.[]'),

  showApproverActions: function() {
    if (this.get('canApprove') && !this.get('isOwnMentorReply') && this.get('isEditingApproverReply')) {
      return true;
    } else {
      return this.get('canApprove') && !this.get('isOwnMentorReply') && !this.get('showReplyInput');
    }
  }.property('isOwnMentorReply', 'canApprove', 'showReplyInput', 'isEditingApproverReply'),

  showNoActionsMessage: function() {
    return this.get('responseToApprove.status') === 'approved' && !this.get('showUndoApproval');
  }.property('responseToApprove.status', 'showUndoApproval'),

  showApprove: function() {
    return this.get('responseToApprove.status') !== 'approved' && this.get('responseToApprove.status') !== 'superceded';
  }.property('responseToApprove.status'),

  showCompose: function() {
    return this.get('responseToApprove.status') !== 'approved' && this.get('responseToApprove.status') !== 'superceded';
  }.property('responseToApprove.status'),

  showUndoApproval: function() {
    return this.get('responseToApprove.status') === 'approved' && !this.get('responseToApprove.wasReadByRecipient');
  }.property('responseToApprove.status', 'responseToApprove.wasReadByRecipient'),

  canEditApproverReply: function() {
    if (!this.get('displayReply')) {
      return false;
    }
    return this.get('currentUser.isAdmin') || this.get('isOwnDisplayReply');
  }.property('currentUser', 'isOwnDisplayReply'),
  canReviseApproverReply: function() {
    return this.get('isOwnDisplayReply');
  }.property('isOwnDisplayReply'),

  showApproverEdit: function() {
    return this.get('canEditApproverReply') && !this.get('isRevisingApproverReply') && !this.get('isEditingApproverReply') && !this.get('isFinishingDraft');
  }.property('canEditApproverReply', 'isRevisingApproverReply', 'isEditingApproverReply', 'isFinishingDraft'),

  showApproverRevise: function() {
    return this.get('canReviseApproverReply') && !this.get('isDraft') && !this.get('showReplyInput') && this.get('showCompose');
  }.property('canReviseApproverReply', 'showReplyInput', 'isDraft', 'showCompose'),

  showResumeDraft: function() {
    return this.get('isOwnDisplayReply') && this.get('isDraft') && !this.get('showReplyInput');
  }.property('isOwnDisplayReply', 'isDraft', 'showReplyInput'),

  isOwnDisplayReply: function() {
    return this.get('currentUser.id') === this.get('displayReply.createdBy.id');
  }.property('currentUser', 'displayReply'),

  isDisplayReplyToYou: function() {
    let recipientId = this.get('utils').getBelongsToId(this.get('displayReply'), 'recipient');
    return this.get('currentUser.id') === recipientId;
  }.property('currentUser', 'displayReply.recipient'),

  showReplyInput: function() {
    return this.get('isEditingApproverReply') || this.get('isRevisingApproverReply') || this.get('isComposingReply') || this.get('isFinishingDraft');
  }.property('isEditingApproverReply', 'isRevisingApproverReply', 'isComposingReply', 'isFinishingDraft'),

  showDisplayReplyActions: function () {
    return !this.get('showReplyInput');
  }.property('showReplyInput'),

  replyHeadingText: function() {
    if (this.get('isEditingApproverReply')) {
      return 'Editing Reply';
    }
    if (this.get('isRevisingApproverReply')) {
      return 'New Revision';
    }
    if (this.get('isComposingReply')) {
      return 'New Reply';
    }
  }.property('isEditingApproverReply', 'isRevisingApproverReply', 'isComposingReply'),

  canTrash: function() {
    return this.get('canApprove');
  }.property('canApprove'),
  showTrash: function() {
    return this.get('canApprove') && !this.get('showReplyInput');
  }.property('showReplyInput', 'canApprove'),

  statusOptions: {
    'needsRevisions': 'Needs Revisions',
    'approved': 'Approved',
    'pendingApproval': 'Pending Approval',
    'superceded': 'Superceded'
  },
  getQuillErrors() {
    let errors = [];
    if (this.get('isQuillEmpty')) {
      errors.addObject('emptyReplyError');
    }
    if (this.get('isQuillTooLong')) {
      errors.addObject('quillTooLongError');
    }
    return errors;
  },

  returnSizeDisplay(bytes) {
    if(bytes < 1024) {
      return bytes + ' bytes';
    } else if(bytes >= 1024 && bytes < 1048576) {
      return (bytes/1024).toFixed(1) + 'KB';
    } else if(bytes >= 1048576) {
      return (bytes/1048576).toFixed(1) + 'MB';
    }
  },

  quillTooLongErrorMsg: function() {
    let len = this.get('quillText.length');
    let maxLength = this.get('maxResponseLength');
    let maxSizeDisplay = this.returnSizeDisplay(maxLength);
    let actualSizeDisplay = this.returnSizeDisplay(len);

    return `The total size of your response (${actualSizeDisplay}) exceeds the maximum limit of ${maxSizeDisplay}. Please remove or resize any large images and try again.`;
  }.property('quillText.length', 'maxResponseLength'),

  clearErrorProps() {
    this.removeMessages(this.get('errorPropsToRemove'));
  },

  isOldFormatDisplayResponse: function() {
    let text = this.get('displayReply.text');
    let parsed = new DOMParser().parseFromString(text, 'text/html');
    return !Array.from(parsed.body.childNodes).some(node => node.nodeType === 1);
  }.property('displayReply.text'),

  recipientReadUnreadIcon: function() {
    let results = {};
    if (this.get('displayReply.wasReadByRecipient')) {
      results.className = 'far fa-envelope-open';
      results.title = 'Recipient has seen message';
    } else {
      results.className = 'far fa-envelope';
      results.title = 'Recipient has not seen message';
    }
    return results;
  }.property('displayReply.wasReadByRecipient'),

  showRecipientReadUnread: function() {
    return !this.get('isDisplayReplyToYou') && this.get('displayReply.status') !== 'draft';
  }.property('isDisplayReplyToYou', 'displayReply.status'),

  revisionsToolTip: 'Replies are sorted from oldest to newest, left to right.',

  actions: {
    composeReply() {
      this.set('isComposingReply', true);
    },
    stopComposing() {
      this.set('isComposingReply', false);
      this.set('editRevisionText', '');
    },
    cancelReply() {
      let props = ['isEditingApproverReply', 'isRevisingApproverReply', 'isComposingReply', 'isFinishingDraft'];
      props.forEach((prop) => {
        if (this.get(prop)) {
          this.set(prop, false);
        }
      });
      this.set('editRevisionText', '');
    },
    editApproverReply() {
      this.set('isEditingApproverReply', true);
      this.set('editRevisionText', this.get('displayReply.text'));
    },
    reviseApproverReply() {
      this.set('isRevisingApproverReply', true);
      this.set('editRevisionText', this.get('displayReply.text'));
    },
    confirmApproval() {
      this.get('alert').showModal('question', 'Are you sure you want to approve this feedback?', 'Once approved the intended recipient will be able to view the reply.', 'Approve')
        .then((result) => {
          if (result.value) {
            this.get('responseToApprove').set('status', 'approved');
            this.get('responseToApprove').set('approvedBy', this.get('currentUser'));
            return this.get('responseToApprove').save();
          }
        })
        .then((saved) => {
          if (saved) {
            this.get('alert').showToast('success', 'Feedback Approved', 'bottom-end', 3000, false, null);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'approvalErrors', this.get('responseToApprove'));
        });

    },

    saveReply(newStatus, isDraft) {
      this.clearErrorProps();

      let quillErrors = this.getQuillErrors();
      if (quillErrors.length > 0) {
        quillErrors.forEach(errorProp => {
          this.set(errorProp, true);
        });
        return;
      }

      let text = this.get('quillText');

      let trimmed = text.trim();

      let replyStatus = 'approved';
      let toastMessage = 'Reply Sent';

      if (isDraft) {
        replyStatus = 'draft';
        toastMessage = 'Draft Saved';
      }
      let record = this.get('store').createRecord('response', {
        recipient: this.get('responseToApprove.createdBy.content'),
        createdBy: this.get('currentUser'),
        submission: this.get('submission'),
        workspace: this.get('workspace'),
        status: replyStatus,
        responseType: 'approver',
        source: 'submission',
        reviewedResponse: this.get('responseToApprove') || this.get('reviewedResponse'),
        text: trimmed
      });

      let hash = {
        newReply: record.save(),
      };

      if (!isDraft) {
        this.get('responseToApprove').set('status', newStatus);
        if (newStatus === 'approved') {
          this.get('responseToApprove').set('approvedBy', this.get('currentUser'));
          record.set('isApproverNoteOnly', true);
        }
        hash.updatedReply = this.get('responseToApprove').save();
      }
    return Ember.RSVP.hash(hash)
    .then((hash) => {
      if (!hash) {
        return;
      }
      this.send('cancelReply');

      this.get('subResponses').addObject(hash.newReply);
      this.set('replyToView', hash.newReply);
      this.get('alert').showToast('success', toastMessage, 'bottom-end', 3000, false, null);
      this.get('handleResponseThread')(hash.newReply, 'approver');
    })
    .catch((err) => {
      this.handleErrors(err, 'saveRecordErrors', null, [record, this.get('responseToApprove')]);
    });
  },
    setReplyToView(response) {
      if (!response || this.get('displayReply.id') === response.get('id')) {
        return;
      }
      ['isEditingApproverReply', 'isRevisingApproverReply', 'isFinishingDraft'].forEach((prop) => {
        if (this.get(prop)) {
          this.set(prop, false);
        }
      });
      this.handleRecipientRead(response);

      this.set('replyToView', response);
    },

    startEditing() {
      this.set('editRevisionText', this.get('displayReply.text'));
      this.set('editRevisionNote', this.get('displayReply.note'));
      this.set('isEditingApproverReply', true);
    },
    stopEditing() {
      this.set('isEditingApproverReply', false);
      this.set('editRevisionText', '');
      this.set('editRevisionNote', '');
      this.clearErrorProps();
    },
    startRevising() {
      this.set('editRevisionText', this.get('displayReply.text'));
      this.set('editRevisionNote', this.get('displayReply.note'));

      this.set('isRevisingApproverReply', true);
    },
    stopRevising() {
      this.set('isRevisingApproverReply', false);
      this.set('editRevisionText', '');
      this.set('editRevisionNote', '');
      this.clearErrorProps();

    },
    resumeDraft() {
      this.set('editRevisionText', this.get('displayReply.text'));

      this.set('isFinishingDraft', true);
    },

    stopDraft() {
      this.set('isFinishingDraft', false);

      this.set('editRevisionText', '');
      this.set('editRevisionNote', '');

      this.clearErrorProps();
    },

    saveDraft(newStatus) {
      this.clearErrorProps();

      let quillErrors = this.getQuillErrors();
      if (quillErrors.length > 0) {
        quillErrors.forEach(errorProp => {
          this.set(errorProp, true);
        });
        return;
      }

      let oldMessageBody = this.get('displayReply.text');
      let messageBody = this.get('quillText');

      // if they clicked Needs Revisions or Approve, there are changes
      if (newStatus === 'draft') {
        if (oldMessageBody === messageBody) {
          this.get('alert').showToast('info', 'No changes to save', 'bottom-end', 3000, false, null);
          this.set('isFinishingDraft', false);
          this.set('editRevisionText', '');

          return;
        }
      }

      this.get('displayReply').set('text', messageBody);

      let isDraft = newStatus === 'draft';
      let toastMessage = 'Draft Saved';

      let responseToUpdate;
      if (!isDraft) {
        toastMessage = 'Reply Sent';

        if (this.get('responseToApprove')) {
          responseToUpdate = this.get('responseToApprove');
        } else {
          let reviewedResponseId = this.get('utils').getBelongsToId(this.get('displayReply'), 'reviewedResponse');
          let reviewedResponse;

          if (reviewedResponseId) {
            reviewedResponse = this.get('store').peekRecord('response', reviewedResponseId);
          }

          responseToUpdate = reviewedResponse;

        }
        if (responseToUpdate) {
          responseToUpdate.set('status', newStatus);
        }

        this.get('displayReply').set('status', 'approved');
        if (newStatus === 'approved') {
          if (responseToUpdate) {
            responseToUpdate.set('approvedBy', this.get('currentUser'));
          }
          this.get('displayReply').set('isApproverNoteOnly', true);
        }
      }

      let hash = {
        newReply: this.get('displayReply').save()
      };

      if (!isDraft && responseToUpdate) {
        hash.updatedResponse = responseToUpdate.save();
      }

    Ember.RSVP.hash(hash)
      .then((hash) => {
        this.get('alert').showToast('success', toastMessage, 'bottom-end', 3000, false, null);
        this.set('isFinishingDraft', false);
        this.set('editRevisionText', '');
      })
      .catch((err) => {
        this.handleErrors(err, 'saveRecordErrors', this.get('displayReply'));
      });
    },

    saveEdit() {
      this.clearErrorProps();

      let quillErrors = this.getQuillErrors();

      if (quillErrors.length > 0) {
        quillErrors.forEach(errorProp => {
          this.set(errorProp, true);
        });
        return;
      }

      let oldText = this.get('displayReply.text');
      let newText = this.get('quillText');

      let oldNote = this.get('displayReply.note');
      let newNote = this.get('editRevisionNote');

      if (oldText === newText && oldNote === newNote) {
        this.get('alert').showToast('info', 'No changes to save', 'bottom-end', 3000, false, null);
        this.set('isEditingApproverReply', false);
        return;
      }

      this.get('displayReply').set('text', newText);
      this.get('displayReply').set('note', newNote);

      this.get('displayReply').save()
        .then((saved) => {
          this.get('alert').showToast('success', 'Response Updated', 'bottom-end', 3000, false, null);
          this.set('isEditingApproverReply', false);
          this.set('editRevisionText', '');
        })
        .catch((err) => {
          this.handleErrors(err, 'saveRecordErrors', this.get('displayReply'));
        });
    },

    saveRevision() {
      this.clearErrorProps();

      let quillErrors = this.getQuillErrors();

      if (quillErrors.length > 0) {
        quillErrors.forEach(errorProp => {
          this.set(errorProp, true);
        });
        return;
      }

      let oldText = this.get('displayReply.text');
      let newText = this.get('quillText');

      let oldNote = this.get('displayReply.note');
      let newNote = this.get('editRevisionNote');

      if (oldText === newText && oldNote === newNote) {
        this.get('alert').showToast('info', 'No changes to save', 'bottom-end', 3000, false, null);

        this.set('isRevisingApproverReply', false);
        return;
      }

      let copy = this.get('displayReply').toJSON({includeId: false});
      delete copy.approvedBy;
      delete copy.lastModifiedDate;
      delete copy.lastModifiedBy;
      delete copy.wasReadByRecipient;
      delete copy.wasReadByApprover;

      copy.text = newText;
      copy.note = newNote;

      copy.createDate = new Date();
      let revision = this.get('store').createRecord('response', copy);
      revision.set('createdBy', this.get('currentUser'));
      revision.set('submission', this.get('displayReply.submission'));
      revision.set('workspace', this.get('displayReply.workspace'));
      revision.set('priorRevision', this.get('displayReply'));
      revision.set('recipient', this.get('displayReply.recipient.content'));
      revision.set('reviewedResponse', this.get('reviewedResponses') || this.get('responseToApprove'));

      revision.save()
        .then((saved) => {
          this.get('alert').showToast('success', 'Revision Sent', 'bottom-end', 3000, false, null);
          this.set('isRevisingApproverReply', false);
          this.set('editRevisionText', '');
          this.get('subResponses').addObject(saved);
          this.get('handleResponseThread')(saved, 'approver');
        })
        .catch((err) => {
          this.handleErrors(err, 'saveRecordErrors', revision);
        });
    },
    confirmTrash(response) {
      if (!response) {
        return;
      }

      return this.get('alert').showModal('warning', 'Are you sure you want to delete this response?', '', 'Delete')
        .then((result) => {
          if (result.value) {
            response.set('isTrashed', true);
            return response.save();
          }
        })
        .then((saved) => {
          if(saved) {
            this.get('alert').showToast('success', 'Response Deleted', 'bottom-end', 3000, false, null);
            this.set('replyToView', null);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'recordSaveErrors', response);
        });

    },
    updateQuillText(content, isEmpty, isOverLengthLimit) {
      this.set('quillText', content);
      this.set('isQuillEmpty', isEmpty);
      this.set('isQuillTooLong', isOverLengthLimit);
    },
    undoApproval() {
      this.get('alert').showModal('question', 'Are you sure you want to unapprove this mentor reply?', 'The new status will be "Pending Approval"', 'Unapprove')
      .then((result) => {
        if (result.value) {
          this.get('responseToApprove').set('status', 'pendingApproval');
          this.get('responseToApprove').set('approvedBy', null);
          this.get('responseToApprove').set('unapprovedBy', this.get('currentUser'));

          return this.get('responseToApprove').save();
        }
      })
      .then((saved) => {
        if (saved) {
          this.get('alert').showToast('success', 'Feedback Unapproved', 'bottom-end', 3000, false, null);
        }
      })
      .catch((err) => {
        this.displayErrorToast(err, this.get('responseToApprove'));
      });
    }
  }

});