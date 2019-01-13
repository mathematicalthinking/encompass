Encompass.ResponseApproverReplyComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'response-approver-reply',
  alert: Ember.inject.service('sweet-alert'),

  showNoActionsMessage: Ember.computed.equal('responseToApprove.status', 'approved'),
  noActionToTakeMessage: 'This Mentor Reply has already been approved and sent to its intended recipient. There are no further approval actions to take at this time.',

  didReceiveAttrs() {
    if (this.get('isReviewingMentorReply')) {
      // load up all previous revisions for this mentor reply
      this.loadPreviousRevisions();
    }
    this._super(...arguments);
  },

  showApprove: function() {
    return this.get('responseToApprove.status') === 'pending';
  }.property('responseToApprove.status'),
  showCompose: function() {
    return this.get('responseToApprove.status') === 'pendingApproval';
  }.property('responseToApprove.status'),
  showEdit: function() {
    return this.get('responseToApprove.status') === 'pendingApproval';
  }.property('responseToApprove.status'),

  actions: {
    composeReply() {
      this.set('isComposingReply', true);
    },
    cancelReply() {
      this.set('isComposingReply', false);
    },
    confirmApproval() {

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
      record.save()
        .then((response) => {
          this.get('alert').showToast('success', 'Reply Sent', 'bottom-end', 3000, false, null);
          this.send('cancelReply');
        })
        .catch((err) => {
          this.send('cancelReply');
          this.set('recordCreateErr', err);
        });
    }
  }

});