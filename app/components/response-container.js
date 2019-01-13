Encompass.ResponseContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'response-container',
  wsPermissions: Ember.inject.service('workspace-permissions'),
  submission: null,
  subResponses: [],
  primaryResponseType: Ember.computed.alias('response.responseType'),

  isCreatingNewMentorReply: false,

  didReceiveAttrs() {
    if (this.get('response.isNew')) {
      this.set('isCreatingNewMentorReply', true);
    } else {
      if (this.get('primaryResponseType') === 'approver') {
        if (this.get('isPrimaryRecipient')) {
          // load other mentor replies
          this.loadPreviousMentorReplies()
          .then((responses) => {
            if (!this.get('isDestroying') || !this.get('isDestroyed')) {
              this.set('mentorReplies', responses.toArray());
            }
          });
        } else if (this.get('canApprove')) {
          this.loadPreviousApproverReplies()
          .then((responses) => {
            if (!this.get('isDestroying') || !this.get('isDestroyed')) {
              this.set('approverReplies', responses.toArray());
            }
          });
        }
      }
    }

    this._super(...arguments);
  },
  responseToApprove: function() {
    if (this.get('primaryResponseType') === 'mentor' && this.get('canApprove') && !this.get('isCreatingNewMentorReply')) {
      return this.get('response');
    }
    return null;
  }.property('canApprove', 'primaryResponseType', 'isPrimaryRecipient', 'isCreatingNewMentorReply'),
  isPrimaryRecipient: function() {
    return this.get('response.recipient.id') === this.get('currentUser.id');
  }.property('response.recipient.id', 'currentUser.id'),

  isMentorRecipient: function() {
    return this.get('isPrimaryRecipient') && this.get('primaryResponseType') === 'mentor';
   }.property('isPrimaryRecipient', 'primaryResponseType'),

  isOwnResponse: function() {
    return this.get('response.createdBy.id') === this.get('currentUser.id');
   }.property('response.createdBy.id', 'currentUser.id'),

  isOwnMentorReply: function() {
    return this.get('isOwnResponse') && this.get('primaryResponseType') === 'mentor';
   },

  menteeResponse: function() {
    if (this.get('isMentorRecipient')) {
      return this.get('response');
    }
    return null;
   }.property('isMentorRecipient', 'response'),

  mentorReplyDisplayResponse: function() {
    if (this.get('responseToApprove')) {
      return this.get('responseToApprove');
    }
    if (this.get('menteeResponse')) {
      return this.get('menteeResponse');
    }
    if (this.get('isOwnMentorReply')) {
      return this.get('response');
    }
    return null;
  }.property('menteeResponse', 'responseToApprove', 'isOwnMentorReply'),

  canApprove: function() {
    return this.get('wsPermissions').canApproveFeedback(this.get('workspace'));
  }.property('workspace', 'currentUser', 'workspace.feedbackAuthorizers.[]'),

  showApproverReply: function() {
    return !this.get('isCreatingNewMentorReply') && (this.get('primaryResponseType') === 'approver' || this.get('canApprove'));
  }.property('response.responseType', 'canApprove', 'isCreatingNewMentorReply'),

  canDirectSend: function() {
    return this.get('wsPermissions').canEdit(this.get('workspace'), 'feedback', 2);
  }.property('workspace', 'currentUser'),

  canSend: function() {
    return this.get('wsPermissions').canEdit(this.get('workspace'), 'feedback', 1);
  }.property('workspace', 'currentUser'),

  approvers: function() {
    if (!this.get('workspace')) {
      return [];
    }
    return this.get('workspace.feedbackAuthorizers');
  }.property('workspace.feedbackAuthorizers'),

  queryResponses(params) {
    return this.get('store').query('response', params);
  },

  loadPreviousApproverReplies() {
    return this.queryResponses({
      filterBy: {
        createdBy: this.get('currentUser.id'),
        submission: this.get('submission.id'),
        responseType: 'approver',
        reviewedResponse: this.get('response.id')
      }
    });
  },
  loadPreviousMentorReplies() {
    return this.queryResponses({
      filterBy: {
        createdBy: this.get('currentUser.id'),
        submission: this.get('submission.id'),
        responseType: 'mentor'
      }
    });
  },
  actions: {
    onSaveSuccess(response) {
      this.sendAction('toResponse', response.get('id'));
    },
  }
});