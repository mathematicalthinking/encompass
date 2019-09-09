/*global _:false */
Encompass.ResponseContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'response-container',
  wsPermissions: Ember.inject.service('workspace-permissions'),
  submission: null,
  subResponses: [],
  primaryResponseType: Ember.computed.alias('response.responseType'),

  isCreatingNewMentorReply: false,
  areMentorReplies: Ember.computed.gt('mentorReplies.length', 0),
  utils: Ember.inject.service('utility-methods'),

  isParentWorkspace: Ember.computed.equal('workspace.workspaceType', 'parent'),

  didReceiveAttrs() {
    this.set('subResponses', this.get('responses'));
    this.handleResponseViewAudit();

    let relatedNtfs = this.findRelatedNtfs('response', this.get('response'));

    relatedNtfs.forEach((ntf) => {
      let isClean = !ntf.get('wasSeen') && !ntf.get('isTrashed');

      if (isClean) {
        ntf.set('wasSeen', true);
        ntf.set('isTrashed', true);
        ntf.save();
      }
    });
    if (this.get('response.isNew')) {
      this.set('isCreatingNewMentorReply', true);
      return;
    }
    if (this.get('primaryResponseType') === 'approver') {
      this.get('response.reviewedResponse')
        .then((response) => {
          if (!this.get('isDestroying') && !this.get('isDestroyed')) {
            this.set('reviewedResponse', response);
          }
        });
      }

    if (!this.get('isMentorRecipient') && this.get('primaryResponseType') === 'mentor') {
      return this.get('response.priorRevision')
      .then((revision) => {
        if (!this.get('isDestroying') && !this.get('isDestroyed')) {
          this.set('priorMentorRevision', revision);
        }
      });
    }

    this._super(...arguments);
  },

  iconFillOptions: {
    approved: '#35A853',
    pendingApproval: '#FFD204',
    needsRevisions: '#EB5757',
    superceded: '#9b59b6',
    draft: '#778899'
  },

  handleResponseViewAudit() {
    let newSubNotifications = this.findRelatedNtfs('response', this.get('submission'), 'newWorkToMentor', 'submission');

    newSubNotifications.forEach((ntf) => {
      if (!ntf.get('wasSeen') && !ntf.get('isTrashed')) {
        ntf.set('wasSeen', true);
        ntf.save();
      }
    });

    if (this.get('isPrimaryRecipient')) {
      if (!this.get('response.wasReadByRecipient')) {
        this.get('response').set('wasReadByRecipient', true);
        this.get('response').save();
      }
    } else if (this.get('response.status') === 'pendingApproval' && this.get('canApprove')) {
      if (!this.get('response.wasReadByApprover')) {
        this.get('response').set('wasReadByApprover', true);
        this.get('response').save();
      }
    }
  },
  cleanStoreResponses: function() {
    let responses = this.get('storeResponses') || [];
    return responses.rejectBy('isTrashed');
  }.property('storeResponses.@each.isTrashed'),

  newResponses: function() {
    return this.get('cleanStoreResponses').filter((response) => {
      let subId = this.get('utils').getBelongsToId(response, 'submission');

      if (subId !== this.get('submission.id')) {
        return false;
      }
      return !this.get('nonTrashedResponses').includes(response);
    });
  }.property('cleanStoreResponses.[]', 'nonTrashedResponses.[]', 'submission'),

  combinedResponses: function() {
    return this.get('nonTrashedResponses').addObjects(this.get('newResponses'));
  }.property('newResponses.[]', 'nonTrashedResponses.[]'),

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
    return this.get('subResponses')
      .rejectBy('isTrashed');
  }.property('subResponses.@each.isTrashed'),

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
    return this.get('combinedResponses').filter((response) => {
      let id = response.belongsTo('reviewedResponse').id();
      return response.get('responseType') === 'approver' && reviewedResponseId === id;
    });

  }.property('primaryApproverReply', 'mentorReplyDisplayResponse', 'combinedResponses.[]'),

  mentorReplies: function() {
    return this.get('combinedResponses').filterBy('responseType', 'mentor');
  }.property('combinedResponses.[]',),

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

   isDisplayMentorReplyYours: function() {
    let reply = this.get('mentorReplyDisplayResponse');
    if (!reply) {
      return false;
    }
    let creatorId = this.get('utils').getBelongsToId(reply, 'createdBy');
    return creatorId === this.get('currentUser.id');
   }.property('mentorReplyDisplayResponse'),

  isOwnMentorReply: function() {
    return this.get('isDisplayMentorReplyYours');
   }.property('isDisplayMentorReplyYours'),

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
    if (this.get('primaryResponseType') === 'mentor') {
      return this.get('response');
    }
    if (this.get('reviewedResponse')) {
      return this.get('reviewedResponse');
    }

    return null;
  }.property('menteeResponse', 'responseToApprove', 'reviewedResponse', 'response'),

  canApprove: function() {
    return this.get('wsPermissions').canApproveFeedback(this.get('workspace'));
  }.property('workspace', 'currentUser', 'workspace.feedbackAuthorizers.[]'),

  showApproverReply: function() {
    if (this.get('isCreatingNewMentorReply')) {
      return false;
    }

    if (this.get('isParentWorkspace')) {
      // only interested in seeing mentor replies for parent workspace?
      return false;
    }
    if (this.get('primaryResponseType') === 'approver') {
      return true;
    }
    if (!this.get('areMentorReplies')) {
      return false;
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

  existingSubmissionMentors: function() {
    return this.get('mentorReplies')
      .mapBy('createdBy.content')
      .uniqBy('id');
  }.property('mentorReplies.@each.createdBy'),

  findExistingResponseThread(threadType, threadId) {
    let peekedResponseThreads = this.get('store').peekAll('response-thread').toArray();
    if (!peekedResponseThreads) {
      return;
    }

    return peekedResponseThreads.find((thread) => {
      return thread.get('threadType') === threadType && _.isEqual(thread.get('id'), threadId);
    });

  },

  cleanWorkspaceResponses: function() {
    return this.get('cleanStoreResponses').filter((response) => {
      return this.get('utils').getBelongsToId(response, 'workspace') === this.get('workspace.id');
    });
  }.property('cleanStoreResponses.[]'),
  actions: {
    onSaveSuccess(submission, response) {
      let responseId = !response ? null : response.get('id');
      this.sendAction('toResponse', submission.get('id'), responseId);
    },
    onMentorReplySwitch(response) {
      let subId = response.belongsTo('submission').id();
      this.sendAction('toResponse', subId, response.get('id'));
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
    },
    onSubmissionChange(sub) {
      this.sendAction('toResponseSubmission', sub.get('id'));
    },
    toNewResponse: function() {
      this.sendAction('toNewResponse', this.get('submission.id', this.get('workspace.id')));
    },

    sendSubmissionRevisionNotices(oldSub, newSub) {
      if (!this.get('existingSubmissionMentors')) {
        return;
      }
      // just send out from here for now
      // should find better way to do in post save hook on backend

      // add submission to existing thread
      this.send('handleResponseThread', null, 'submitter', newSub);

      this.get('existingSubmissionMentors').forEach((user) => {
        let notification = this.get('store').createRecord('notification', {
          createdBy: this.get('currentUser'),
          recipient: user,
          notificationType: 'newWorkToMentor',
          primaryRecordType: 'response',
          submission: newSub,
          createDate: new Date(),
          text: 'There is a new revision for you to mentor.',
          workspace: this.get('workspace')
        });
        notification.save();
      });
    },
    handleResponseThread(response, threadType, submission) {
      let studentId;
      let mentorId;
      let threadId;
      let workspaceId = this.get('workspace.id');
      let workspaceName = this.get('workspace.name');
      // mentorThreadId is workspaceId + studentId

      if (threadType === 'mentor') {
        studentId = this.get('utils').getBelongsToId(response, 'recipient');
        threadId = workspaceId + studentId;
      } else if (threadType === 'approver') {
        // id is workspaceId + studentId + mentorId
        mentorId = this.get('utils').getBelongsToId(response, 'recipient');

        let reviewedResponseId = this.get('utils').getBelongsToId(response, 'reviewedResponse');

        if (reviewedResponseId) {
          let reviewedResponse = this.get('store').peekRecord('response', reviewedResponseId);
          if (reviewedResponse) {
            studentId = this.get('utils').getBelongsToId(reviewedResponse, 'recipient');

            threadId = workspaceId + studentId + mentorId;
          }
        }
      } else if (threadType === 'submitter') {
        // id is 'srt' + workspaceId
        threadId = 'srt' + workspaceId;
      }

      let existingThread = this.findExistingResponseThread(threadType, threadId);

      // should always be existing thead if creating a response from this component
      if (existingThread) {
        if (threadType === 'submitter') {
          existingThread.get('submissions').addObject(submission);
        } else {
          existingThread.get('responses').addObject(response);
        }
      } else {
        // create new thread
        let submissionId = this.get('utils').getBelongsToId(response, 'submission');

        let submission = this.get('store').peekRecord('submission', submissionId);

        let problemTitle;
        let studentDisplay;

        if (submission) {
          problemTitle = submission.get('publication.puzzle.title');
          studentDisplay = submission.get('creator.username');
        }

        let newThread = this.get('store').createRecord('response-thread', {
          threadType,
          id: threadId,
          workspaceName,
          problemTitle,
          studentDisplay,
          isNewThread: true,
        });

        if (mentorId) {
          newThread.set('mentors', [mentorId]);
        }
        if (submission) {
          newThread.get('submissions').addObject(submission);
        }
        if (response) {
          newThread.get('responses').addObject(response);
        }
      }
    },
  }
});