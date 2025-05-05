import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { alias, equal, gt } from '@ember/object/computed';
import { set } from '@ember/object';
import isEqual from 'lodash-es/isEqual';
export default class ResponseContainer extends Component {
  @service('current-user') currentUser;
  @service('workspace-permissions') wsPermissions;
  @service store;
  @service('error-handling') errorHandling;
  @service('utility-methods') utils;
  @service notificationService;
  @tracked submission = null;
  @tracked subResponses = [];
  @tracked isCreatingNewMentorReply = false;

  @alias('response.responseType') primaryResponseType;
  @equal('workspace.workspaceType', 'parent') isParentWorkspace;
  @gt('mentorReplies.length', 0) areMentorReplies;

  iconFillOptions = {
    approved: '#35A853',
    pendingApproval: '#FFD204',
    needsRevisions: '#EB5757',
    superceded: '#9b59b6',
    draft: '#778899',
  };

  constructor() {
    super(...arguments);
    set('subResponses', this.responses);
    this.handleResponseViewAudit();

    let relatedNtfs = this.notificationService.findRelatedNtfs(
      'response',
      this.response
    );

    relatedNtfs.forEach((ntf) => {
      let isClean = !ntf.get('wasSeen') && !ntf.get('isTrashed');

      if (isClean) {
        ntf.set('wasSeen', true);
        ntf.set('isTrashed', true);
        ntf.save();
      }
    });

    if (this.response.isNew) {
      this.isCreatingNewMentorReply = true;
      return;
    }

    if (this.primaryResponseType === 'approver') {
      this.response.reviewedResponse.then((response) => {
        if (!this.isDestroying && !this.isDestroyed) {
          set(this, 'reviewedResponse', response);
        }
      });
    }

    if (!this.isMentorRecipient && this.primaryResponseType === 'mentor') {
      this.response.priorRevision.then((revision) => {
        if (!this.isDestroying && !this.isDestroyed) {
          this.priorMentorRevision = revision;
        }
      });
    }
  }

  @computed('storeResponses.@each.isTrashed')
  get cleanStoreResponses() {
    let responses = this.storeResponses || [];
    return responses.rejectBy('isTrashed');
  }

  @computed('cleanStoreResponses.[]', 'nonTrashedResponses.[]', 'submission.id')
  get newResponses() {
    return this.cleanStoreResponses.filter((response) => {
      let subId = this.utils.getBelongsToId(response, 'submission');

      if (subId !== this.submission.id) {
        return false;
      }
      return !this.nonTrashedResponses.includes(response);
    });
  }

  @computed('newResponses.[]', 'nonTrashedResponses.[]')
  get combinedResponses() {
    return this.nonTrashedResponses.addObjects(this.newResponses);
  }

  @computed('submissions.[]')
  get sortedSubmissions() {
    return this.submissions
      .rejectBy('isTrashed')
      .sortBy('createDate')
      .reverse();
  }

  @computed('isOwnSubmission', 'submission.student')
  get studentName() {
    return `${this.submission.student}`;
  }

  @computed('submission.creator.studentId', 'currentUser.user.id')
  get isOwnSubmission() {
    return this.submission.creator.studentId === this.currentUser.user.id;
  }

  @computed('subResponses.@each.isTrashed')
  get nonTrashedResponses() {
    return this.subResponses.rejectBy('isTrashed');
  }

  @computed(
    'combinedResponses.[]',
    'mentorReplyDisplayResponse.id',
    'primaryApproverReply'
  )
  get approverReplies() {
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
      return response.responseType === 'approver' && reviewedResponseId === id;
    });
  }

  @computed('combinedResponses.[]')
  get mentorReplies() {
    return this.combinedResponses.filterBy('responseType', 'mentor');
  }

  @computed(
    'canApprove',
    'isCreatingNewMentorReply',
    'isPrimaryRecipient',
    'primaryResponseType',
    'response'
  )
  get responseToApprove() {
    if (
      this.primaryResponseType === 'mentor' &&
      this.canApprove &&
      !this.isCreatingNewMentorReply
    ) {
      return this.response;
    }
    return null;
  }

  @computed('response.recipient.id', 'currentUser.user.id')
  get isPrimaryRecipient() {
    return this.response.recipient.id === this.currentUser.user.id;
  }

  @computed('isPrimaryRecipient', 'primaryResponseType')
  get isMentorRecipient() {
    return this.isPrimaryRecipient && this.primaryResponseType === 'mentor';
  }

  @computed('response.createdBy.id', 'currentUser.user.id')
  get isOwnResponse() {
    return this.response.createdBy.id === this.currentUser.user.id;
  }

  @computed('currentUser.user.id', 'mentorReplyDisplayResponse')
  get isDisplayMentorReplyYours() {
    let reply = this.mentorReplyDisplayResponse;
    if (!reply) {
      return false;
    }
    let creatorId = this.utils.getBelongsToId(reply, 'createdBy');
    return creatorId === this.currentUser.user.id;
  }

  @computed('isDisplayMentorReplyYours')
  get isOwnMentorReply() {
    return this.isDisplayMentorReplyYours;
  }

  @computed('isOwnResponse', 'primaryResponseType')
  get isOwnApproverReply() {
    return this.isOwnResponse && this.primaryResponseType === 'approver';
  }

  @computed('primaryResponseType', 'response')
  get primaryApproverReply() {
    if (this.primaryResponseType === 'approver') {
      return this.response;
    }
    return null;
  }

  @computed('isMentorRecipient', 'response')
  get menteeResponse() {
    if (this.isMentorRecipient) {
      return this.response;
    }
    return null;
  }

  @computed(
    'menteeResponse',
    'primaryResponseType',
    'response',
    'responseToApprove',
    'reviewedResponse'
  )
  get mentorReplyDisplayResponse() {
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

  @computed('workspace', 'currentUser.user', 'workspace.feedbackAuthorizers.[]')
  get canApprove() {
    return this.wsPermissions.canApproveFeedback(this.workspace);
  }

  @computed(
    'areMentorReplies',
    'canApprove',
    'canDirectSend',
    'isCreatingNewMentorReply',
    'isOwnMentorReply',
    'isParentWorkspace',
    'primaryResponseType'
  )
  get showApproverReply() {
    if (this.isCreatingNewMentorReply) {
      return false;
    }

    if (this.isParentWorkspace) {
      return false;
    }
    if (this.primaryResponseType === 'approver') {
      return true;
    }
    if (!this.areMentorReplies) {
      return false;
    }

    if (this.isOwnMentorReply) {
      return !this.canDirectSend;
    }
    return this.canApprove;
  }

  @computed('workspace', 'currentUser.user')
  get canDirectSend() {
    return this.wsPermissions.canEdit(this.workspace, 'feedback', 2);
  }

  @computed('workspace', 'currentUser.user')
  get canSend() {
    return this.wsPermissions.canEdit(this.workspace, 'feedback', 1);
  }

  @computed('workspace.feedbackAuthorizers.[]')
  get approvers() {
    if (!this.workspace) {
      return [];
    }
    return this.workspace.feedbackAuthorizers;
  }

  @computed('mentorReplies.@each.createdBy')
  get existingSubmissionMentors() {
    return this.mentorReplies.mapBy('createdBy.content').uniqBy('id');
  }

  findExistingResponseThread(threadType, threadId) {
    let peekedResponseThreads = this.store.peekAll('response-thread').toArray();
    if (!peekedResponseThreads) {
      return;
    }

    return peekedResponseThreads.find((thread) => {
      return thread.threadType === threadType && isEqual(thread.id, threadId);
    });
  }

  @computed('cleanStoreResponses.[]', 'workspace.id')
  get cleanWorkspaceResponses() {
    return this.cleanStoreResponses.filter((response) => {
      return (
        this.utils.getBelongsToId(response, 'workspace') === this.workspace.id
      );
    });
  }

  @action
  toggleCreatingNewMentorReply(val) {
    if (val === undefined) {
      val = !this.isCreatingNewMentorReply;
    }
    this.isCreatingNewMentorReply = val;
  }

  @action
  removeResponse(response) {
    if (!response) {
      return;
    }
    let nonTrashed = this.subResponses.filter((res) => {
      return res.id !== response.id;
    });
    this.subResponses = nonTrashed;
  }

  @action
  updateResponse(response) {
    if (!response) {
      return;
    }

    let resId = response.get('id');

    if (!resId) {
      return;
    }

    let isSubRes = this.subResponses.find((res) => {
      return res.id === resId;
    });

    if (!isSubRes) {
      this.subResponses.addObject(response);
    }
  }

  @action
  cancelMentorReply() {
    this.response.rollbackAttributes();
  }

  @action
  cancelApproverReply() {
    if (this.primaryApproverReply) {
      this.primaryApproverReply.rollbackAttributes();
    }
  }

  @action
  handleError(err) {
    this.errorHandling.handleError(err, {
      throwError: true,
    });
  }
}
