Encompass.ResponseApproverReplyComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'response-approver-reply',
  alert: Ember.inject.service('sweet-alert'),

  showNoActionsMessage: Ember.computed.equal('responseToApprove.status', 'approved'),
  noActionToTakeMessage: 'This Mentor Reply has already been approved and sent to its intended recipient. There are no further approval actions to take at this time.',

  showNoPreviousRepliesMsg: Ember.computed.equal('approverReplies.length', 0),
  replyToView: null,

  didReceiveAttrs() {
    if (this.get('primaryApproverReply')) {
      this.set('replyToView', this.get('primaryApproverReply'));
    }
    this._super(...arguments);
  },

  displayReply: function() {
    if (this.get('replyToView')) {
      return this.get('replyToView');
    }
    if (this.get('sortedApproverReplies')) {
      return this.get('sortedApproverReplies.firstObject');
    }
    return null;
  }.property('replyToView', 'sortedApproverReplies.[]'),
  sortedApproverReplies: function() {
    if (!this.get('approverReplies')) {
      return [];
    }
    return this.get('approverReplies')
      .rejectBy('isTrashed')
      .sortBy('createDate')
      .reverse();

  }.property('approverReplies.@each.isTrashed'),

  showApproverActions: function() {
    return this.get('canApprove') && !this.get('isOwnMentorReply') && !this.get('showReplyInput');
  }.property('isOwnMentorReply', 'canApprove', 'showReplyInput'),

  showApprove: function() {
    return this.get('responseToApprove.status') !== 'approved';
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

  actions: {
    composeReply() {
      this.set('isComposingReply', true);
    },
    cancelReply() {
      let props = ['isEditingApproverReply', 'isRevisingApproverReply', 'isComposingReply'];
      props.forEach((prop) => {
        if (this.get(prop)) {
          this.set(prop, false);
        }
      });
      this.set('replyText', '');
    },
    editApproverReply() {
      this.set('isEditingApproverReply', true);
      this.set('replyText', this.get('displayReply.text'));
    },
    reviseApproverReply() {
      this.set('isRevisingApproverReply', true);
      this.set('replyText', this.get('displayReply.text'));
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
          this.handleErrors(err, 'approvalErrors');
        });

    },
    editMentorReply() {

    },

    saveReply() {
      let record = this.get('store').createRecord('response', {
        recipient: this.get('responseToApprove.createdBy'),
        createdBy: this.get('currentUser'),
        submission: this.get('submission'),
        workspace: this.get('workspace'),
        status: 'approved',
        responseType: 'approver',
        source: 'submission',
        reviewedResponse: this.get('responseToApprove'),
        text: this.get('replyText')
      });
      this.get('responseToApprove').set('status', 'needsRevisions');
      Ember.RSVP.hash({
        newReply: record.save(),
        updatedReply: this.get('responseToApprove').save()
      })
        .then((hash) => {
          this.send('cancelReply');

          this.get('approverReplies').addObject(hash.newReply);
          this.set('replyToView', hash.newReply);
          this.get('alert').showToast('success', 'Reply Sent', 'bottom-end', 3000, false, null);
        })
        .catch((err) => {
          this.send('cancelReply');
          this.set('recordCreateErr', err);
        });
    },
    setReplyToView(response) {
      if (!response || this.get('displayReply.id') === response.get('id')) {
        return;
      }
      this.set('replyToView', response);
    }
  }

});