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
    return this.cleanStoreResponses.filter(
      (response) =>
        this.utils.getBelongsToId(response, 'workspace') === this.workspace?.id
    );
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
    return this.store
      .peekAll('response-thread')
      .find(
        (thread) => thread.threadType === threadType && thread.id === threadId
      );
  }

  __getBaseUrl() {
    const { protocol, host, pathname } = window.location;
    return `${protocol}//${host}/${pathname.split('/')[1]}`;
  }

  __generateThreadId(threadType, response, workspaceId) {
    if (threadType === 'submitter') {
      return 'srt' + workspaceId;
    }

    if (threadType === 'mentor') {
      const studentId = this.utils.getBelongsToId(response, 'recipient');
      return workspaceId + studentId;
    }

    if (threadType === 'approver') {
      const mentorId = this.utils.getBelongsToId(response, 'recipient');
      const reviewedResponseId = this.utils.getBelongsToId(
        response,
        'reviewedResponse'
      );

      if (reviewedResponseId) {
        const reviewedResponse = this.store.peekRecord(
          'response',
          reviewedResponseId
        );
        if (reviewedResponse) {
          const studentId = this.utils.getBelongsToId(
            reviewedResponse,
            'recipient'
          );
          return { threadId: workspaceId + studentId + mentorId, mentorId };
        }
      }
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

  @action
  openProblem() {
    const problemId = this.submission?.answer?.problem?.id;
    if (!problemId) return;

    window.open(
      `${this.__getBaseUrl()}#/problems/${problemId}`,
      'newwindow',
      'width=1200, height=700'
    );
  }

  @action
  openSubmission(workspaceId, submissionId) {
    if (!workspaceId || !submissionId) return;

    window.open(
      `${this.__getBaseUrl()}#/workspaces/${workspaceId}/submissions/${submissionId}`,
      'newwindow',
      'width=1200, height=700'
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
        workspace: this.workspace,
      });
      notification.save();
    });
  }

  @action
  handleResponseThread(response, threadType, submission) {
    const workspaceId = this.workspace?.id;
    const threadIdResult = this.__generateThreadId(
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
      workspaceName: this.workspace?.name,
      problemTitle: sub?.publication?.puzzle?.title,
      studentDisplay: sub?.creator?.username,
      isNewThread: true,
    });

    if (mentorId) newThread.set('mentors', [mentorId]);
    if (sub) newThread.submissions.addObject(sub);
    if (response) newThread.responses.addObject(response);
  }
}
