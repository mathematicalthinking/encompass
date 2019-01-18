Encompass.ResponseApproverReplyComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'response-approver-reply',
  alert: Ember.inject.service('sweet-alert'),

  showNoActionsMessage: Ember.computed.equal('responseToApprove.status', 'approved'),
  noActionToTakeMessage: 'This Mentor Reply has already been approved and sent to its intended recipient. There are no further approval actions to take at this time.',

  showNoPreviousRepliesMsg: Ember.computed.equal('approverReplies.length', 0),
  replyToView: null,

  didReceiveAttrs() {
    if (!this.get('approverReplies.length') > 0 ) {
      this.set('replyToView', null);
    }
    this.set('replyToView', this.get('primaryReply') || null);

    this._super(...arguments);
  },

  displayReply: function() {
    if (this.get('replyToView')) {
      return this.get('replyToView');
    }

    return this.get('sortedApproverReplies.lastObject') || null;
  }.property('replyToView', 'sortedApproverReplies.[]'),

  sortedApproverReplies: function() {
    if (!this.get('approverReplies')) {
      return [];
    }
    return this.get('approverReplies')
      .rejectBy('isTrashed')
      .sortBy('createDate');
  }.property('approverReplies.[]'),

  showApproverActions: function() {
    return this.get('canApprove') && !this.get('isOwnMentorReply') && !this.get('showReplyInput');
  }.property('isOwnMentorReply', 'canApprove', 'showReplyInput'),

  showApprove: function() {
    return this.get('responseToApprove.status') !== 'approved' && this.get('responseToApprove.status') !== 'superceded';
  }.property('responseToApprove.status'),
  showCompose: function() {
    return this.get('responseToApprove.status') !== 'approved';
  }.property('responseToApprove.status'),
  showEdit: function() {
    return this.get('responseToApprove.status') === 'pendingApproval';
  }.property('responseToApprove.status'),

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
    return this.get('canEditApproverReply') && !this.get('isRevisingApproverReply') && !this.get('isEditingApproverReply');
  }.property('canEditApproverReply', 'isRevisingApproverReply', 'isEditingApproverReply'),
  showApproverRevise: function() {
    return this.get('canReviseApproverReply') && !this.get('isRevisingApproverReply') && !this.get('isEditingApproverReply');
  }.property('canReviseApproverReply', 'isRevisingApproverReply', 'isEditingApproverReply'),
  isOwnDisplayReply: function() {
    return this.get('currentUser.id') === this.get('displayReply.createdBy.id');
  }.property('currentUser', 'displayReply'),

  showReplyInput: function() {
    return this.get('isEditingApproverReply') || this.get('isRevisingApproverReply') || this.get('isComposingReply');
  }.property('isEditingApproverReply', 'isRevisingApproverReply', 'isComposingReply'),

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

  actions: {
    composeReply() {
      this.set('isComposingReply', true);
    },
    stopComposing() {
      this.set('isComposingReply', false);
      this.set('editRevisionText', '');
    },
    cancelReply() {
      let props = ['isEditingApproverReply', 'isRevisingApproverReply', 'isComposingReply'];
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

    saveReply() {
      this.removeMessages(['saveRecordErrors','emptyReplyError']);

      let text = this.get('editRevisionText');

      if (typeof text !== 'string' || text.trim().length === 0) {
        this.set('emptyReplyError', true);
        return;
      }

      let trimmed = text.trim();

      let record = this.get('store').createRecord('response', {
        recipient: this.get('responseToApprove.createdBy.content'),
        createdBy: this.get('currentUser'),
        submission: this.get('submission'),
        workspace: this.get('workspace'),
        status: 'approved',
        responseType: 'approver',
        source: 'submission',
        reviewedResponse: this.get('responseToApprove') || this.get('reviewedResponse'),
        text: trimmed
      });

      let oldMentorStatus = this.get('responseToApprove.status');

      let promptText = 'What should now be the status of the Mentor Feedback you are replying to?';

      return this.get('alert').showPromptSelect(promptText, this.get('statusOptions'), 'Select a status', null, 'Send')
        .then((result) => {
          if (!result.value) {
            return;
          }

          let hash = {
            newReply: record.save(),
          };

          if (oldMentorStatus !== result.value) {
            this.get('responseToApprove').set('status', result.value);
            if (result.value === 'approved') {
              this.get('responseToApprove').set('approvedBy', this.get('currentUser'));
            }
            hash.updatedReply = this.get('responseToApprove').save();
          }
          return Ember.RSVP.hash(hash);
        })
        .then((hash) => {
          if (!hash) {
            return;
          }
          this.send('cancelReply');

          this.get('approverReplies').addObject(hash.newReply);
          this.set('replyToView', hash.newReply);
          this.get('alert').showToast('success', 'Reply Sent', 'bottom-end', 3000, false, null);
        })
        .catch((err) => {
          this.handleErrors(err, 'saveRecordErrors', null, [record, this.get('repsonseToApprove')]);
        });
    },
    setReplyToView(response) {
      if (!response || this.get('displayReply.id') === response.get('id')) {
        return;
      }
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
      this.removeMessages(['saveRecordErrors','emptyReplyError']);
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
      this.removeMessages(['saveRecordErrors','emptyReplyError']);

    },
    saveEdit() {
      this.removeMessages(['saveRecordErrors','emptyReplyError']);

      let oldText = this.get('displayReply.text');
      let newText = this.get('editRevisionText');

      let oldNote = this.get('displayReply.note');
      let newNote = this.get('editRevisionNote');

      if (oldText === newText && oldNote === newNote) {
        this.set('isEditingApproverReply', false);
        return;
      }
      if (!newText || newText.length === 0) {
        this.set('emptyReplyError', true);
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
      this.removeMessages(['saveRecordErrors','emptyReplyError']);

      let oldText = this.get('displayReply.text');
      let newText = this.get('editRevisionText');

      let oldNote = this.get('displayReply.note');
      let newNote = this.get('editRevisionNote');

      if (oldText === newText && oldNote === newNote) {
        this.set('isRevisingApproverReply', false);
        return;
      }
      if (!newText || newText.length === 0) {
        this.set('emptyReplyError', true);
        return;
      }

      let copy = this.get('displayReply').toJSON({includeId: false});
      delete copy.approvedBy;
      delete copy.lastModifiedDate;
      delete copy.lastModifiedBy;

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
          this.get('approverReplies').addObject(saved);
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
             this.get('toResponses')();
          }
          // just go to responses page for now?
        })
        .catch((err) => {
          this.handleErrors(err, 'recordSaveErrors', response);
        });

    }
  }

});