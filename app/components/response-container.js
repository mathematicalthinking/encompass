import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

// Lodash ok to keep; used for deep equality in thread lookup
import isEqual from 'lodash-es/isEqual';

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

  // ===== Convenience getters for @args =====
  get response()    { return this.args.response; }
  get submission()  { return this.args.submission; }
  get workspace()   { return this.args.workspace; }
  get submissions() { return this.args.submissions ?? []; }
  get storeResponses() { return this.args.storeResponses ?? []; }

  // ===== Lifecycle-ish setup via constructor (no async) =====
  constructor() {
    console.log('>>> ResponseContainer.constructor');
    super(...arguments);

    // The local working set for current-submission responses
    this.subResponses = [...(this.args.responses ?? [])];

    this._auditResponseViewAndCleanNotifications();

    // New mentor reply flag
    if (this.response?.isNew) {
      this.isCreatingNewMentorReply = true;
    }

    // Load related references without making the ctor async
    if (this.primaryResponseType === 'approver') {
      this.response?.reviewedResponse?.then((res) => {
        if (!this.isDestroying && !this.isDestroyed) this.reviewedResponse = res ?? null;
      });
    }

    if (!this.isMentorRecipient && this.primaryResponseType === 'mentor') {
      this.response?.priorRevision?.then((rev) => {
        if (!this.isDestroying && !this.isDestroyed) this.priorMentorRevision = rev ?? null;
      });
    }
  }

  _auditResponseViewAndCleanNotifications() {
    // keep prior behavior: mark related notifications seen/trashed
    const related = this.notificationService?.findRelatedNtfs?.('response', this.response) ?? [];
    for (const ntf of related) {
      const wasSeen = ntf.get?.('wasSeen');
      const isTrashed = ntf.get?.('isTrashed');
      if (!wasSeen && !isTrashed) {
        ntf.set?.('wasSeen', true);
        ntf.set?.('isTrashed', true);
        ntf.save?.();
      }
    }
  }

  // ===== Derived state (formerly @computed / alias / equal / gt) =====
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
    // storeResponses that belong to this submission but aren't in local subResponses yet
    const currSubId = this.submission?.id;
    const nonTrashedIds = new Set(this.nonTrashedResponses.map((r) => r.id));
    return this.cleanStoreResponses.filter((r) => {
      const subId = this.utils.getBelongsToId(r, 'submission');
      return subId === currSubId && !nonTrashedIds.has(r.id);
    });
  }

  get combinedResponses() {
    // Merge without duplicates
    const byId = new Map();
    for (const r of this.nonTrashedResponses) byId.set(r.id, r);
    for (const r of this.newResponses) byId.set(r.id, r);
    return [...byId.values()];
  }

  get sortedSubmissions() {
    return this.submissions
      .filter((s) => !s.isTrashed)
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  }

  get studentName() {
    // maintain shape from original
    return `${this.submission?.student ?? ''}`;
  }

  get isOwnSubmission() {
    return this.submission?.creator?.studentId === this.currentUser?.user?.id;
  }

  get mentorReplies() {
    return this.combinedResponses.filter((r) => r.responseType === 'mentor');
  }

  get areMentorReplies() {
    return this.mentorReplies.length > 0;
  }

  get isPrimaryRecipient() {
    return this.response?.recipient?.id === this.currentUser?.user?.id;
  }

  get isMentorRecipient() {
    return this.isPrimaryRecipient && this.primaryResponseType === 'mentor';
  }

  get isOwnResponse() {
    return this.response?.createdBy?.id === this.currentUser?.user?.id;
  }

  get isDisplayMentorReplyYours() {
    const reply = this.mentorReplyDisplayResponse;
    if (!reply) return false;
    const creatorId = this.utils.getBelongsToId(reply, 'createdBy');
    return creatorId === this.currentUser?.user?.id;
  }

  get isOwnMentorReply() {
    return this.isDisplayMentorReplyYours;
  }

  get isOwnApproverReply() {
    return this.isOwnResponse && this.primaryResponseType === 'approver';
  }

  get primaryApproverReply() {
    return this.primaryResponseType === 'approver' ? this.response : null;
  }

  get menteeResponse() {
    return this.isMentorRecipient ? this.response : null;
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

  get canApprove() {
    return this.wsPermissions?.canApproveFeedback?.(this.workspace) ?? false;
  }

  get canDirectSend() {
    return this.wsPermissions?.canEdit?.(this.workspace, 'feedback', 2) ?? false;
  }

  get canSend() {
    return this.wsPermissions?.canEdit?.(this.workspace, 'feedback', 1) ?? false;
  }

  get approvers() {
    return this.workspace?.feedbackAuthorizers ?? [];
  }

  get existingSubmissionMentors() {
    // unique by id
    const list = this.mentorReplies.map((r) => r?.createdBy?.content).filter(Boolean);
    const seen = new Set();
    const out = [];
    for (const p of list) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        out.push(p);
      }
    }
    return out;
  }

  get approverReplies() {
    let reviewedResponseId = null;

    if (this.primaryApproverReply) {
      reviewedResponseId = this.primaryApproverReply.belongsTo('reviewedResponse').id();
    } else if (this.mentorReplyDisplayResponse) {
      reviewedResponseId = this.mentorReplyDisplayResponse.id;
    }

    if (!reviewedResponseId) return [];
    return this.combinedResponses.filter((r) => {
      const id = r.belongsTo('reviewedResponse').id();
      return r.responseType === 'approver' && id === reviewedResponseId;
    });
  }

  get cleanWorkspaceResponses() {
    const wsId = this.workspace?.id;
    return this.cleanStoreResponses.filter(
      (r) => this.utils.getBelongsToId(r, 'workspace') === wsId
    );
  }

  findExistingResponseThread(threadType, threadId) {
    const all = this.store.peekAll('response-thread')?.toArray?.() ?? [];
    return all.find((t) => t.threadType === threadType && isEqual(t.id, threadId));
  }

  // ===== Mutations / handlers =====
  toggleCreatingNewMentorReply = (val) => {
    this.isCreatingNewMentorReply = (val === undefined) ? !this.isCreatingNewMentorReply : !!val;
  };

  removeResponse = (response) => {
    if (!response) return;
    this.subResponses = this.subResponses.filter((r) => r.id !== response.id);
  };

  updateResponse = (response) => {
    if (!response) return;
    const id = response.get?.('id') ?? response.id;
    if (!id) return;
    if (!this.subResponses.find((r) => r.id === id)) {
      this.subResponses = [...this.subResponses, response];
    }
  };

  cancelMentorReply = () => {
    this.response?.rollbackAttributes?.();
  };

  cancelApproverReply = () => {
    this.primaryApproverReply?.rollbackAttributes?.();
  };

  handleError = (err) => {
    this.errorHandling.handleError(err, { throwError: true });
  };

  // ===== Navigation hooks (service-backed) =====
  openSubmission = (_workspaceId, submissionId) => {
    this.navigation.toResponseSubmission(submissionId);
  };

  // If you have a specific "problem" route, call it here; otherwise no-op placeholder.
  openProblem = () => {};

  // ===== Pass-throughs for child API (keep shape; no-ops if not provided downstream) =====
  onSubmissionChange = (...args) => this.args.onSubChange?.(...args);
  sendSubmissionRevisionNotices = (...args) => this.args.sendRevisionNotices?.(...args);
  onSaveSuccess = (...args) => this.args.onSaveSuccess?.(...args);
  onMentorReplySwitch = (...args) => this.args.onMentorReplySwitch?.(...args);
  toResponses = () => this.navigation.toResponses();
  toNewResponse = (submissionId, workspaceId) => this.navigation.toNewResponse(submissionId, workspaceId);
  handleResponseThread = (...args) => this.args.handleResponseThread?.(...args);
}