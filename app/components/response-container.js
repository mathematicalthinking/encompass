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
      this.get('response.reviewedResponse')
        .then((response) => {
          if (!this.get('isDestroying') && !this.get('isDestroyed')) {
            this.set('reviewedResponse', response);
          }
        });
      }

    this._super(...arguments);
  },
  studentDescriptor: function() {
    if (this.get('isOwnSubmission')) {
      return 'your';
    }
    return `${this.get('submission.student')}'s`;
  }.property('isOwnSubmission', 'submission.student'),

  isOwnSubmission: function() {
    return this.get('submission.creator.studentId') === this.get('currentUser.id');
  }.property('submission.creator.studentId', 'currentUser.id'),

  nonTrashedResponses: function() {
    return this.get('responses')
      .rejectBy('isTrashed')
      .filter((response) => {
        let subId = response.belongsTo('submission').id();
        return this.get('submission.id') === subId;
      });
  }.property('responses.@each.isTrashed', 'submission.id'),

  approverReplies: function() {
    let reviewedResponseId;

    if (this.get('primaryApproverReply')) {
      reviewedResponseId = this.get('primaryApproverReply').belongsTo('reviewedResponse').id();
    } else {
      if (this.get('mentorReplyDisplayResponse')) {
        reviewedResponseId = this.get('mentorReplyDisplayResponse.id');
      }
    }

    if (!reviewedResponseId) {
      return [];
    }
    return this.get('nonTrashedResponses').filter((response) => {
      let id = response.belongsTo('reviewedResponse').id();
      return response.get('responseType') === 'approver' && reviewedResponseId === id;
    });

  }.property('primaryApproverReply', 'mentorReplyDisplayResponse', 'nonTrashedResponses.[]'),

  mentorReplies: function() {
    if (!this.get('mentorReplyDisplayResponse')) {
      return [];
    }
    let mentorId = this.get('mentorReplyDisplayResponse').belongsTo('createdBy').id();

    return this.get('nonTrashedResponses').filter((response) => {
      let id = response.belongsTo('createdBy').id();
          return response.get('responseType') === 'mentor' && mentorId === id;
        });

  }.property('mentorReplyDisplayResponse', 'nonTrashedResponses.[]'),

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
    return null;
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
    if (this.get('isCreatingNewMentorReply')) {
      return false;
    }
    if (this.get('primaryResponseType') === 'approver') {
      return true;
    }
    // if you have direct send, do not show approver panel if you are viewing your own reply
    if (this.get('isOwnMentorReply')) {
      return !this.get('canDirectSend');
    }
    return this.get('canApprove');
  }.property('primaryResponseType', 'canApprove', 'isCreatingNewMentorReply', 'isOwnMentorReply', 'canDirectSend'),

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

  actions: {
    onSaveSuccess(response) {
      this.sendAction('toResponse', response.get('id'));
    },
    onMentorReplySwitch(response) {
      this.sendAction('toResponseInfo',response);
    },
    toResponses() {
      this.sendAction('toResponses');
    },
    openSubmission(workspaceId, submissionId) {
      if (!workspaceId || !submissionId) {
        return;
      }

      let getUrl = window.location;
      let baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

      window.open(`${baseUrl}#/workspaces/${workspaceId}/submissions/${submissionId}`, 'newwindow', 'width=1200, height=700');
    }
  }
});