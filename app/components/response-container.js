Encompass.ResponseContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'response-container',
  wsPermissions: Ember.inject.service('workspace-permissions'),
  submission: null,
  subResponses: [],
  primaryResponseType: Ember.computed.alias('response.responseType'),

  isCreatingNewMentorReply: false,

  didReceiveAttrs() {
    if (this.get('response.isNew')) {
      this.set('isCreatingNewMentorReply', true);
      return;
    } else if (this.get('primaryResponseType') === 'approver') {
      let reviewedResponse;
      this.get('response.reviewedResponse')
        .then((response) => {
          reviewedResponse = response;
          Ember.RSVP.hash({
            mentorReplies: this.loadPreviousMentorReplies(reviewedResponse.get('createdBy.id')),
            approverReplies: this.loadPreviousApproverReplies(reviewedResponse.get('id'))
          })
          .then((hash) => {
            if (!this.get('isDestroying') || !this.get('isDestroyed')) {
              this.set('reviewedResponse', reviewedResponse);
              this.set('mentorReplies', hash.mentorReplies.toArray());
              this.set('approverReplies', hash.approverReplies.toArray());
            }
          });
        });
      } else if (this.get('primaryResponseType') === 'mentor') {
        Ember.RSVP.hash({
          mentorReplies: this.loadPreviousMentorReplies(this.get('response.createdBy.id')),
          approverReplies: this.loadPreviousApproverReplies(this.get('response.id'))
        })
        .then((hash) => {
          if (!this.get('isDestroying') || !this.get('isDestroyed')) {
            this.set('mentorReplies', hash.mentorReplies.toArray());
            this.set('approverReplies', hash.approverReplies.toArray());
          }
        });
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
   }.property('isOwnResponse', 'primaryResponseType'),

   isOwnApproverReply: function() {
    return this.get('isOwnResponse') && this.get('primaryResponseType') === 'approver';
   }.property('isOwnResponse', 'primaryResponseType'),

  primaryApproverReply: function() {
    if (this.get('primaryResponseType') === 'approver') {
      return this.get('response');
    }
  }.property('primaryResponseType'),

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
    if (this.get('reviewedResponse')) {
      return this.get('reviewedResponse');
    }
    return null;
  }.property('menteeResponse', 'responseToApprove', 'isOwnMentorReply', 'reviewedResponse'),

  canApprove: function() {
    return this.get('wsPermissions').canApproveFeedback(this.get('workspace'));
  }.property('workspace', 'currentUser', 'workspace.feedbackAuthorizers.[]'),

  showApproverReply: function() {
    return !this.get('isCreatingNewMentorReply') && (this.get('primaryResponseType') === 'approver' || this.get('canApprove') || this.get('isOwnMentorReply'));
  }.property('primaryResponseType', 'canApprove', 'isCreatingNewMentorReply', 'isOwnMentorReply'),

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
  }.property('workspace.feedbackAuthorizers.[]'),

  queryResponses(params) {
    return this.get('store').query('response', params);
  },

  loadPreviousApproverReplies(mentorReply) {
    return this.queryResponses({
      filterBy: {
        submission: this.get('submission.id'),
        responseType: 'approver',
        reviewedResponse: this.get('response.id')
      }
    });
  },
  loadPreviousMentorReplies(creator) {
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
      console.log('oss rc', response);
      this.sendAction('toResponse', response.get('id'));
    },
    onMentorReplySwitch(response) {
      console.log('omrs', response);
      if (this.get('primaryResponseType') === 'mentor') {
        // this.queryResponses({
        //   filterBy: {
        //     submission: this.get('submission.id'),
        //     responseType: 'approver',
        //     reviewedResponse: response.get('id'),
        //   }
        // })
        // .then((responses) => {
        //   this.set('approverReplies', responses.toArray());
        //   this.set()
        // })
        // .catch((err) => {
        //   this.handleErrors(err, 'dataFetchErrors');
        // });
        this.sendAction('toResponseInfo',response);
      } else {
        this.set('reviewedResponse', response);
      }
    }
  }
});