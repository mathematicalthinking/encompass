import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { alias, equal, gt } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(CurrentUserMixin, ErrorHandlingMixin, {
  elementId: 'response-container',
  wsPermissions: service('workspace-permissions'),
  submission: null,
  subResponses: [],
  primaryResponseType: alias('response.responseType'),

  isCreatingNewMentorReply: false,
  areMentorReplies: gt('mentorReplies.length', 0),
  utils: service('utility-methods'),

  isParentWorkspace: equal('workspace.workspaceType', 'parent'),

  didReceiveAttrs() {
    this.set('subResponses', this.responses);
    this.handleResponseViewAudit();

    let relatedNtfs = this.findRelatedNtfs('response', this.response);

    relatedNtfs.forEach((ntf) => {
      let isClean = !ntf.get('wasSeen') && !ntf.get('isTrashed');

      if (isClean) {
        ntf.set('wasSeen', true);
        ntf.set('isTrashed', true);
        ntf.save();
      }
    });
    if (this.response.isNew) {
      this.set('isCreatingNewMentorReply', true);
      return;
    }
    if (this.primaryResponseType === 'approver') {
      this.response.reviewedResponse.then((response) => {
        if (!this.isDestroying && !this.isDestroyed) {
          this.set('reviewedResponse', response);
        }
      });
    }

    if (!this.isMentorRecipient && this.primaryResponseType === 'mentor') {
      return this.response.priorRevision.then((revision) => {
        if (!this.isDestroying && !this.isDestroyed) {
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
    draft: '#778899',
  },

  handleResponseViewAudit() {
    let newSubNotifications = this.findRelatedNtfs(
      'response',
      this.submission,
      'newWorkToMentor',
      'submission'
    );

    newSubNotifications.forEach((ntf) => {
      if (!ntf.get('wasSeen') && !ntf.get('isTrashed')) {
        ntf.set('wasSeen', true);
        ntf.save();
      }
    });

    if (this.isPrimaryRecipient) {
      if (!this.response.wasReadByRecipient) {
        this.response.set('wasReadByRecipient', true);
        this.response.save();
      }
    } else if (this.response.status === 'pendingApproval' && this.canApprove) {
      if (!this.response.wasReadByApprover) {
        this.response.set('wasReadByApprover', true);
        this.response.save();
      }
    }
  },
  cleanStoreResponses: computed('storeResponses.@each.isTrashed', function () {
    let responses = this.storeResponses || [];
    return responses.rejectBy('isTrashed');
  }),

  newResponses: computed(
    'cleanStoreResponses.[]',
    'nonTrashedResponses.[]',
    'submission',
    function () {
      return this.cleanStoreResponses.filter((response) => {
        let subId = this.utils.getBelongsToId(response, 'submission');

        if (subId !== this.submission.id) {
          return false;
        }
        return !this.nonTrashedResponses.includes(response);
      });
    }
  ),

  combinedResponses: computed(
    'newResponses.[]',
    'nonTrashedResponses.[]',
    function () {
      return this.nonTrashedResponses.addObjects(this.newResponses);
    }
  ),

  studentDescriptor: computed(
    'isOwnSubmission',
    'submission.student',
    function () {
      if (this.isOwnSubmission) {
        return 'your';
      }
      return `${this.submission.student}'s`;
    }
  ),

  isOwnSubmission: computed(
    'submission.creator.studentId',
    'currentUser.id',
    () => this.submission.creator.studentId === this.currentUser.id
  ),

  nonTrashedResponses: computed('subResponses.@each.isTrashed', function () {
    return this.subResponses.rejectBy('isTrashed');
  }),

  approverReplies: computed(
    'primaryApproverReply',
    'mentorReplyDisplayResponse',
    'combinedResponses.[]',
    function () {
      let reviewedResponseId;

      if (this.primaryApproverReply) {
        reviewedResponseId = this.primaryApproverReply
          .belongsTo('reviewedResponse')
          .id();
      } else {
        if (this.mentorReplyDisplayResponse) {
          reviewedResponseId = this.mentorReplyDisplayResponse.id;
        }
      }

      if (!reviewedResponseId) {
        return [];
      }
      return this.combinedResponses.filter((response) => {
        let id = response.belongsTo('reviewedResponse').id();
        return (
          response.get('responseType') === 'approver' &&
          reviewedResponseId === id
        );
      });
    }
  ),

  mentorReplies: computed('combinedResponses.[]', function () {
    return this.combinedResponses.filterBy('responseType', 'mentor');
  }),

  responseToApprove: computed(
    'canApprove',
    'primaryResponseType',
    'isPrimaryRecipient',
    'isCreatingNewMentorReply',
    function () {
      if (
        this.primaryResponseType === 'mentor' &&
        this.canApprove &&
        !this.isCreatingNewMentorReply
      ) {
        return this.response;
      }
      return null;
    }
  ),
  isPrimaryRecipient: computed(
    'response.recipient.id',
    'currentUser.id',
    function () {
      return this.response.recipient.id === this.currentUser.id;
    }
  ),

  isMentorRecipient: computed(
    'isPrimaryRecipient',
    'primaryResponseType',
    function () {
      return this.isPrimaryRecipient && this.primaryResponseType === 'mentor';
    }
  ),

  isOwnResponse: computed(
    'response.createdBy.id',
    'currentUser.id',
    function () {
      return this.response.createdBy.id === thiscurrentUser.id;
    }
  ),

  isDisplayMentorReplyYours: computed(
    'mentorReplyDisplayResponse',
    function () {
      let reply = this.mentorReplyDisplayResponse;
      if (!reply) {
        return false;
      }
      let creatorId = this.utils.getBelongsToId(reply, 'createdBy');
      return creatorId === this.currentUser.id;
    }
  ),

  isOwnMentorReply: computed('isDisplayMentorReplyYours', function () {
    return this.isDisplayMentorReplyYours;
  }),

  isOwnApproverReply: computed(
    'isOwnResponse',
    'primaryResponseType',
    function () {
      return this.isOwnResponse && this.primaryResponseType === 'approver';
    }
  ),

  primaryApproverReply: computed('primaryResponseType', function () {
    if (this.primaryResponseType === 'approver') {
      return this.response;
    }
    return null;
  }),

  menteeResponse: computed('isMentorRecipient', 'response', function () {
    if (this.isMentorRecipient) {
      return this.response;
    }
    return null;
  }),

  mentorReplyDisplayResponse: computed(
    'menteeResponse',
    'responseToApprove',
    'reviewedResponse',
    'response',
    function () {
      if (this.responseToApprove) {
        return this.responseToApprove;
      }
      if (this.menteeResponse) {
        return this.menteeResponse;
      }
      if (this.primaryResponseType === 'mentor') {
        return this.response;
      }
      if (this.reviewedResponse) {
        return this.reviewedResponse;
      }

      return null;
    }
  ),

  canApprove: computed(
    'workspace',
    'currentUser',
    'workspace.feedbackAuthorizers.[]',
    function () {
      return this.wsPermissions.canApproveFeedback(this.workspace);
    }
  ),

  showApproverReply: computed(
    'primaryResponseType',
    'canApprove',
    'isCreatingNewMentorReply',
    'isOwnMentorReply',
    'canDirectSend',
    function () {
      if (this.isCreatingNewMentorReply) {
        return false;
      }

      if (this.isParentWorkspace) {
        // only interested in seeing mentor replies for parent workspace?
        return false;
      }
      if (this.primaryResponseType === 'approver') {
        return true;
      }
      if (!this.areMentorReplies) {
        return false;
      }

      // if you have direct send, do not show approver panel if you are viewing your own reply
      if (this.isOwnMentorReply) {
        return !this.canDirectSend;
      }
      return this.canApprove;
    }
  ),

  canDirectSend: computed('workspace', 'currentUser', function () {
    return this.wsPermissions.canEdit(this.workspace, 'feedback', 2);
  }),

  canSend: computed('workspace', 'currentUser', function () {
    return this.wsPermissions.canEdit(this.workspace, 'feedback', 1);
  }),

  approvers: computed('workspace.feedbackAuthorizers.[]', function () {
    if (!this.workspace) {
      return [];
    }
    return this.workspace.feedbackAuthorizers;
  }),

  existingSubmissionMentors: computed(
    'mentorReplies.@each.createdBy',
    function () {
      return this.mentorReplies.mapBy('createdBy.content').uniqBy('id');
    }
  ),

  findExistingResponseThread(threadType, threadId) {
    let peekedResponseThreads = this.store.peekAll('response-thread').toArray();
    if (!peekedResponseThreads) {
      return;
    }

    return peekedResponseThreads.find((thread) => {
      return (
        thread.get('threadType') === threadType &&
        _.isEqual(thread.get('id'), threadId)
      );
    });
  },

  cleanWorkspaceResponses: computed('cleanStoreResponses.[]', function () {
    return this.cleanStoreResponses.filter((response) => {
      return (
        this.utils.getBelongsToId(response, 'workspace') === this.workspace.id
      );
    });
  }),
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
      let baseUrl =
        getUrl.protocol +
        '//' +
        getUrl.host +
        '/' +
        getUrl.pathname.split('/')[1];

      window.open(
        `${baseUrl}#/workspaces/${workspaceId}/submissions/${submissionId}`,
        'newwindow',
        'width=1200, height=700'
      );
    },
    onSubmissionChange(sub) {
      this.sendAction('toResponseSubmission', sub.get('id'));
    },
    toNewResponse: function () {
      this.sendAction('toNewResponse', this.submission.id, this.workspace.id);
    },

    sendSubmissionRevisionNotices(oldSub, newSub) {
      if (!this.existingSubmissionMentors) {
        return;
      }
      // just send out from here for now
      // should find better way to do in post save hook on backend

      // add submission to existing thread
      this.send('handleResponseThread', null, 'submitter', newSub);

      this.existingSubmissionMentors.forEach((user) => {
        let notification = this.store.createRecord('notification', {
          createdBy: this.currentUser,
          recipient: user,
          notificationType: 'newWorkToMentor',
          primaryRecordType: 'response',
          submission: newSub,
          createDate: new Date(),
          text: 'There is a new revision for you to mentor.',
          workspace: this.workspace,
        });
        notification.save();
      });
    },
    handleResponseThread(response, threadType, submission) {
      let studentId;
      let mentorId;
      let threadId;
      let workspaceId = this.workspace.id;
      let workspaceName = this.workspace.name;
      // mentorThreadId is workspaceId + studentId

      if (threadType === 'mentor') {
        studentId = this.utils.getBelongsToId(response, 'recipient');
        threadId = workspaceId + studentId;
      } else if (threadType === 'approver') {
        // id is workspaceId + studentId + mentorId
        mentorId = this.utils.getBelongsToId(response, 'recipient');

        let reviewedResponseId = this.utils.getBelongsToId(
          response,
          'reviewedResponse'
        );

        if (reviewedResponseId) {
          let reviewedResponse = this.store.peekRecord(
            'response',
            reviewedResponseId
          );
          if (reviewedResponse) {
            studentId = this.utils.getBelongsToId(
              reviewedResponse,
              'recipient'
            );

            threadId = workspaceId + studentId + mentorId;
          }
        }
      } else if (threadType === 'submitter') {
        // id is 'srt' + workspaceId
        threadId = 'srt' + workspaceId;
      }

      let existingThread = this.findExistingResponseThread(
        threadType,
        threadId
      );

      // should always be existing thead if creating a response from this component
      if (existingThread) {
        if (threadType === 'submitter') {
          existingThread.get('submissions').addObject(submission);
        } else {
          existingThread.get('responses').addObject(response);
        }
      } else {
        // create new thread
        let submissionId = this.utils.getBelongsToId(response, 'submission');

        let submission = this.store.peekRecord('submission', submissionId);

        let problemTitle;
        let studentDisplay;

        if (submission) {
          problemTitle = submission.get('publication.puzzle.title');
          studentDisplay = submission.get('creator.username');
        }

        let newThread = this.store.createRecord('response-thread', {
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
  },
});
