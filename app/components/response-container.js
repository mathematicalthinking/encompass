import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ResponseContainer extends Component {
  @service currentUser;
  @service('workspace-permissions') wsPermissions;
  @service store;
  @service errorHandling;
  @service('utility-methods') utils;
  @service notificationService;
  @service navigation;

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
    this._cleanupNotifications();

    if (this.args.response?.isNew) {
      this.isCreatingNewMentorReply = true;
      return;
    }

    this._loadAsyncRelationships();
  }

  async _loadAsyncRelationships() {
    if (this.primaryResponseType === 'approver') {
      const response = await this.args.response.reviewedResponse;
      if (!this.isDestroying && !this.isDestroyed) {
        this.reviewedResponse = response;
      }
    }

    if (!this.isMentorRecipient && this.primaryResponseType === 'mentor') {
      const revision = await this.args.response.priorRevision;
      if (!this.isDestroying && !this.isDestroyed) {
        this.priorMentorRevision = revision;
      }
    }
  }

  get submissions() {
    return this.args.submissions || [];
  }

  get storeResponses() {
    return this.args.storeResponses || [];
  }

  get primaryResponseType() {
    return this.args.response?.responseType;
  }

  get isParentWorkspace() {
    return this.args.workspace?.workspaceType === 'parent';
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
      if (subId !== this.args.submission?.id) return false;
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
    return (
      this.args.submission?.creator?.studentId === this.currentUser.user?.id
    );
  }

  get studentName() {
    return `${this.args.submission?.student || ''}`;
  }

  get mentorReplies() {
    return this.combinedResponses.filter((r) => r.responseType === 'mentor');
  }

  get areMentorReplies() {
    return this.mentorReplies.length > 0;
  }

  get isPrimaryRecipient() {
    return this.args.response?.recipient?.id === this.currentUser.user?.id;
  }

  get isMentorRecipient() {
    return this.isPrimaryRecipient && this.primaryResponseType === 'mentor';
  }

  get isOwnResponse() {
    return this.args.response?.createdBy?.id === this.currentUser.user?.id;
  }

  get primaryApproverReply() {
    return this.primaryResponseType === 'approver' ? this.args.response : null;
  }

  get menteeResponse() {
    return this.isMentorRecipient ? this.args.response : null;
  }

  get canApprove() {
    return this.wsPermissions.canApproveFeedback(this.args.workspace);
  }

  get responseToApprove() {
    if (
      this.primaryResponseType === 'mentor' &&
      this.canApprove &&
      !this.isCreatingNewMentorReply
    ) {
      return this.args.response;
    }
    return null;
  }

  get mentorReplyDisplayResponse() {
    if (this.responseToApprove) return this.responseToApprove;
    if (this.menteeResponse) return this.menteeResponse;
    if (this.primaryResponseType === 'mentor') return this.args.response;
    if (this.reviewedResponse) return this.reviewedResponse;
    return null;
  }

  get isOwnMentorReply() {
    const reply = this.mentorReplyDisplayResponse;
    if (!reply) return false;
    const creatorId = this.utils.getBelongsToId(reply, 'createdBy');
    return creatorId === this.currentUser.user?.id;
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
    return this.wsPermissions.canEdit(this.args.workspace, 'feedback', 2);
  }

  get canSend() {
    return this.wsPermissions.canEdit(this.args.workspace, 'feedback', 1);
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
    return this.args.workspace?.feedbackAuthorizers || [];
  }

  get existingSubmissionMentors() {
    return [
      ...new Set(
        this.mentorReplies.map((r) => r.createdBy?.content).filter(Boolean)
      ),
    ];
  }

  get cleanWorkspaceResponses() {
    return this.cleanStoreResponses.filter(
      (response) =>
        this.utils.getBelongsToId(response, 'workspace') ===
        this.args.workspace?.id
    );
  }

  _cleanupNotifications() {
    const relatedNtfs = this.notificationService.findRelatedNtfs(
      'response',
      this.args.response
    );

    relatedNtfs
      .filter((ntf) => !ntf.wasSeen && !ntf.isTrashed)
      .forEach((ntf) => {
        ntf.wasSeen = true;
        ntf.isTrashed = true;
        ntf.save();
      });
  }

  findExistingResponseThread(threadType, threadId) {
    return this.store
      .peekAll('response-thread')
      .find(
        (thread) => thread.threadType === threadType && thread.id === threadId
      );
  }

  _generateThreadId(threadType, response, workspaceId) {
    if (threadType === 'submitter') return `srt${workspaceId}`;

    if (threadType === 'mentor') {
      const studentId = this.utils.getBelongsToId(response, 'recipient');
      return `${workspaceId}${studentId}`;
    }

    if (threadType === 'approver') {
      const mentorId = this.utils.getBelongsToId(response, 'recipient');
      const reviewedResponseId = this.utils.getBelongsToId(
        response,
        'reviewedResponse'
      );

      if (!reviewedResponseId) return null;

      const reviewedResponse = this.store.peekRecord(
        'response',
        reviewedResponseId
      );
      if (!reviewedResponse) return null;

      const studentId = this.utils.getBelongsToId(
        reviewedResponse,
        'recipient'
      );
      return { threadId: `${workspaceId}${studentId}${mentorId}`, mentorId };
    }

    return null;
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
    if (!response?.id) return;

    const exists = this.subResponses.find((res) => res.id === response.id);
    if (!exists) {
      this.subResponses = [...this.subResponses, response];
    }
  }

  @action
  cancelMentorReply() {
    this.args.response?.rollbackAttributes();
  }

  @action
  cancelApproverReply() {
    this.primaryApproverReply?.rollbackAttributes();
  }

  @action
  openProblem() {
    const problemId = this.args.submission?.answer?.problem?.id;
    this.navigation.openProblem(problemId);
  }

  @action
  openSubmission() {
    this.navigation.openSubmission(
      this.args.workspace?.id,
      this.args.submission?.id
    );
  }

  @action
  onSaveSuccess(submission, response) {
    const responseId = response?.id || null;
    this.args.toResponse?.(submission.id, responseId);
  }

  @action
  onMentorReplySwitch(response) {
    const subId = response.belongsTo('submission').id();
    this.args.toResponse?.(subId, response.id);
  }

  @action
  onSubmissionChange(sub) {
    this.args.toResponseSubmission?.(sub.id);
  }

  /**
   * Notifies mentors when a student submits a revised answer.
   *
   * Note: Marked as "broken" in response-submission-view.js.
   * FIX: Old code accepted oldSub but never used it, relying on component state instead.
   * Fixed to query mentor responses from oldSub parameter.
   * TODO: Needs UI verification - test via student account at /#/assignments, submit revision
   *
   * @param {Object} oldSub - The old submission being revised
   * @param {Object} newSub - The newly created submission revision
   */
  @action
  async sendSubmissionRevisionNotices(oldSub, newSub) {
    if (!oldSub || !newSub) return;

    this.handleResponseThread(null, 'submitter', newSub);

    // Query for all mentor responses on the old submission
    const oldSubResponseIds = this.utils.getHasManyIds(oldSub, 'responses');
    if (!oldSubResponseIds?.length) return;

    const mentorResponses = this.store
      .peekAll('response')
      .filter(
        (r) =>
          oldSubResponseIds.includes(r.id) &&
          r.responseType === 'mentor' &&
          !r.isTrashed
      );

    // Get unique mentors who gave feedback
    const mentors = [
      ...new Set(
        mentorResponses.map((r) => r.createdBy?.content).filter(Boolean)
      ),
    ];

    if (!mentors.length) return;

    // Create notifications for each mentor
    mentors.forEach((user) => {
      const notification = this.store.createRecord('notification', {
        createdBy: this.currentUser.user,
        recipient: user,
        notificationType: 'newWorkToMentor',
        primaryRecordType: 'response',
        submission: newSub,
        createDate: new Date(),
        text: 'There is a new revision for you to mentor.',
        workspace: this.args.workspace,
      });
      notification.save();
    });
  }

  @action
  handleResponseThread(response, threadType, submission) {
    const workspaceId = this.args.workspace?.id;
    const threadIdResult = this._generateThreadId(
      threadType,
      response,
      workspaceId
    );

    const threadId =
      typeof threadIdResult === 'object'
        ? threadIdResult.threadId
        : threadIdResult;
    const mentorId =
      typeof threadIdResult === 'object' ? threadIdResult.mentorId : null;

    if (!threadId) return;

    const existingThread = this.findExistingResponseThread(
      threadType,
      threadId
    );

    if (existingThread) {
      const target = threadType === 'submitter' ? 'submissions' : 'responses';
      const item = threadType === 'submitter' ? submission : response;
      existingThread[target].addObject(item);
      return;
    }

    const submissionId =
      threadType === 'submitter'
        ? submission?.id
        : this.utils.getBelongsToId(response, 'submission');
    const sub =
      threadType === 'submitter'
        ? submission
        : this.store.peekRecord('submission', submissionId);

    const newThread = this.store.createRecord('response-thread', {
      threadType,
      id: threadId,
      workspaceName: this.args.workspace?.name,
      problemTitle: sub?.publication?.puzzle?.title,
      studentDisplay: sub?.creator?.username,
      isNewThread: true,
    });

    if (mentorId) newThread.mentors = [mentorId];
    if (sub) newThread.submissions.addObject(sub);
    if (response) newThread.responses.addObject(response);
  }
}
