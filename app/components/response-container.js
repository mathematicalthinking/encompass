import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ResponseContainer extends Component {
  @service currentUser;
  @service wsPermissions;
  @service store;
  @service errorHandling;
  @service utils;
  @service notificationService;

  @tracked subResponses = [];
  @tracked isCreatingNewMentorReply = false;
  @tracked reviewedResponse = null;
  @tracked priorMentorRevision = null;

  iconFillOptions = {
    approved: '#35A853',
    pendingApproval: '#FFD204',
    needsRevisions: '#EB5757',
    superceded: '#9b59b6',
    draft: '#778899',
  };

  constructor() {
    super(...arguments);
    this.subResponses = this.args.responses || [];
    this.__cleanupNotifications();

    if (this.args.response?.isNew) {
      this.isCreatingNewMentorReply = true;
      return;
    }

    if (this.primaryResponseType === 'approver') {
      this.args.response.reviewedResponse.then((response) => {
        if (!this.isDestroying && !this.isDestroyed) {
          this.reviewedResponse = response;
        }
      });
    }

    if (!this.isMentorRecipient && this.primaryResponseType === 'mentor') {
      this.args.response.priorRevision.then((revision) => {
        if (!this.isDestroying && !this.isDestroyed) {
          this.priorMentorRevision = revision;
        }
      });
    }
  }

  get response() {
    return this.args.response;
  }

  get workspace() {
    return this.args.workspace;
  }

  get submission() {
    return this.args.submission;
  }

  get submissions() {
    return this.args.submissions || [];
  }

  get storeResponses() {
    return this.args.storeResponses || [];
  }

  get primaryResponseType() {
    return this.response?.responseType;
  }

  get isParentWorkspace() {
    return this.workspace?.workspaceType === 'parent';
  }

  get cleanStoreResponses() {
    return this.storeResponses.filter((r) => !r.isTrashed);
  }

  get nonTrashedResponses() {
    return this.subResponses.filter((r) => !r.isTrashed);
  }

  get newResponses() {
    return this.cleanStoreResponses.filter((response) => {
      const subId = this.utils.getBelongsToId(response, 'submission');
      if (subId !== this.submission?.id) return false;
      return !this.nonTrashedResponses.includes(response);
    });
  }

  get combinedResponses() {
    return [...this.nonTrashedResponses, ...this.newResponses];
  }

  get sortedSubmissions() {
    return this.submissions
      .filter((s) => !s.isTrashed)
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  }

  get isOwnSubmission() {
    return this.submission?.creator?.studentId === this.currentUser.user?.id;
  }

  get studentName() {
    return `${this.submission?.student || ''}`;
  }

  get mentorReplies() {
    return this.combinedResponses.filter((r) => r.responseType === 'mentor');
  }

  get areMentorReplies() {
    return this.mentorReplies.length > 0;
  }

  get isPrimaryRecipient() {
    return this.response?.recipient?.id === this.currentUser.user?.id;
  }

  get isMentorRecipient() {
    return this.isPrimaryRecipient && this.primaryResponseType === 'mentor';
  }

  get isOwnResponse() {
    return this.response?.createdBy?.id === this.currentUser.user?.id;
  }

  get primaryApproverReply() {
    return this.primaryResponseType === 'approver' ? this.response : null;
  }

  get menteeResponse() {
    return this.isMentorRecipient ? this.response : null;
  }

  get canApprove() {
    return this.wsPermissions.canApproveFeedback(this.workspace);
  }

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

  get mentorReplyDisplayResponse() {
    if (this.responseToApprove) return this.responseToApprove;
    if (this.menteeResponse) return this.menteeResponse;
    if (this.primaryResponseType === 'mentor') return this.response;
    if (this.reviewedResponse) return this.reviewedResponse;
    return null;
  }

  get isDisplayMentorReplyYours() {
    const reply = this.mentorReplyDisplayResponse;
    if (!reply) return false;
    const creatorId = this.utils.getBelongsToId(reply, 'createdBy');
    return creatorId === this.currentUser.user?.id;
  }

  get isOwnMentorReply() {
    return this.isDisplayMentorReplyYours;
  }

  get isOwnApproverReply() {
    return this.isOwnResponse && this.primaryResponseType === 'approver';
  }

  get approverReplies() {
    let reviewedResponseId;

    if (this.primaryApproverReply) {
      reviewedResponseId = this.primaryApproverReply
        .belongsTo('reviewedResponse')
        .id();
    } else if (this.mentorReplyDisplayResponse) {
      reviewedResponseId = this.mentorReplyDisplayResponse.id;
    }

    if (!reviewedResponseId) return [];

    return this.combinedResponses.filter((response) => {
      const id = response.belongsTo('reviewedResponse').id();
      return response.responseType === 'approver' && reviewedResponseId === id;
    });
  }

  get canDirectSend() {
    return this.wsPermissions.canEdit(this.workspace, 'feedback', 2);
  }

  get canSend() {
    return this.wsPermissions.canEdit(this.workspace, 'feedback', 1);
  }

  get showApproverReply() {
    if (this.isCreatingNewMentorReply) return false;
    if (this.isParentWorkspace) return false;
    if (this.primaryResponseType === 'approver') return true;
    if (!this.areMentorReplies) return false;
    if (this.isOwnMentorReply) return !this.canDirectSend;
    return this.canApprove;
  }

  get approvers() {
    return this.workspace?.feedbackAuthorizers || [];
  }

  get existingSubmissionMentors() {
    return [
      ...new Set(
        this.mentorReplies.map((r) => r.createdBy?.content).filter(Boolean)
      ),
    ];
  }

  get cleanWorkspaceResponses() {
    return this.cleanStoreResponses.filter((response) => {
      return (
        this.utils.getBelongsToId(response, 'workspace') === this.workspace?.id
      );
    });
  }

  __cleanupNotifications() {
    const relatedNtfs = this.notificationService.findRelatedNtfs(
      'response',
      this.args.response
    );

    relatedNtfs.forEach((ntf) => {
      const isClean = !ntf.wasSeen && !ntf.isTrashed;
      if (isClean) {
        ntf.wasSeen = true;
        ntf.isTrashed = true;
        ntf.save();
      }
    });
  }

  findExistingResponseThread(threadType, threadId) {
    const peekedResponseThreads = this.store
      .peekAll('response-thread')
      .toArray();
    if (!peekedResponseThreads) return;

    return peekedResponseThreads.find((thread) => {
      return thread.threadType === threadType && thread.id === threadId;
    });
  }

  @action
  toggleCreatingNewMentorReply(val) {
    this.isCreatingNewMentorReply = val ?? !this.isCreatingNewMentorReply;
  }

  @action
  removeResponse(response) {
    if (!response) return;
    this.subResponses = this.subResponses.filter(
      (res) => res.id !== response.id
    );
  }

  @action
  updateResponse(response) {
    if (!response) return;

    const resId = response.id;
    if (!resId) return;

    const exists = this.subResponses.find((res) => res.id === resId);
    if (!exists) {
      this.subResponses = [...this.subResponses, response];
    }
  }

  @action
  cancelMentorReply() {
    this.response?.rollbackAttributes();
  }

  @action
  cancelApproverReply() {
    this.primaryApproverReply?.rollbackAttributes();
  }

  @action
  handleError(err) {
    this.errorHandling.handleError(err, { throwError: true });
  }
}
