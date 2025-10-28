import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
export default class ResponsesListComponent extends Component {
  @service currentUser;
  @service('utility-methods') utils;
  @service router;
  @service store;

  @tracked threads = [];
  @tracked meta = {};
  @tracked isLoadingNewPage = false;
  @tracked currentFilter = 'submitter';

  noResponsesMessage = 'No responses found';
  threadsPerPage = 50;

  get isShowAll() {
    return this.currentFilter === 'all';
  }

  get isShowSubmitter() {
    return this.currentFilter === 'submitter';
  }

  get isShowMentoring() {
    return this.currentFilter === 'mentoring';
  }

  get isShowApproving() {
    return this.currentFilter === 'approving';
  }

  get currentMetadata() {
    const filter = this.currentFilter;
    if (filter === 'submitter') return this.meta.submitter;
    if (filter === 'mentoring') return this.meta.mentoring;
    if (filter === 'approving') return this.meta.approving;
    return null;
  }

  get allThreads() {
    const newThreads =
      this.threads.filter((thread) => thread.isNewThread) || [];
    const threadSet = new Set([...this.threads, ...newThreads]);
    return Array.from(threadSet).filter((thread) => !thread.isTrashed);
  }

  get mentoringThreads() {
    return this.allThreads.filter((thread) => thread.threadType === 'mentor');
  }

  get approvingThreads() {
    return this.allThreads.filter((thread) => thread.threadType === 'approver');
  }

  get submitterThreads() {
    return this.allThreads.filter(
      (thread) => thread.threadType === 'submitter'
    );
  }

  get showSubmitterTab() {
    return this.submitterThreads.length > 0;
  }

  get showMentoringTab() {
    return this.mentoringThreads.length > 0;
  }

  get showApprovingTab() {
    return this.approvingThreads.length > 0;
  }

  showAllFilter = false;

  _sortThreads(threads, options = {}) {
    const { useRevisionFallback = false, validateDates = false } = options;
    return [...threads].sort((a, b) => {
      if (a.sortPriority !== b.sortPriority) {
        return b.sortPriority - a.sortPriority;
      }
      const aReplyDate = new Date(a.latestReply?.createDate);
      const bReplyDate = new Date(b.latestReply?.createDate);

      if (validateDates) {
        const aValid = !isNaN(aReplyDate.getTime());
        const bValid = !isNaN(bReplyDate.getTime());
        if (!aValid && !bValid) {
          const aRevDate = new Date(a.latestRevision?.createDate);
          const bRevDate = new Date(b.latestRevision?.createDate);
          return bRevDate - aRevDate;
        }
      }

      if (
        useRevisionFallback &&
        aReplyDate.getTime() === bReplyDate.getTime()
      ) {
        const aRevDate = new Date(a.latestRevision?.createDate);
        const bRevDate = new Date(b.latestRevision?.createDate);
        return bRevDate - aRevDate;
      }

      return bReplyDate - aReplyDate;
    });
  }

  get sortedApprovingThreads() {
    return this._sortThreads(this.approvingThreads);
  }

  get sortedSubmitterThreads() {
    return this._sortThreads(this.submitterThreads, {
      useRevisionFallback: true,
    });
  }

  get sortedMentoringThreads() {
    return this._sortThreads(this.mentoringThreads, {
      useRevisionFallback: true,
      validateDates: true,
    });
  }

  get showMentorHeader() {
    return this.currentFilter !== 'mentoring';
  }

  get showStudentHeader() {
    return this.currentFilter !== 'submitter';
  }

  _getThreadCounts() {
    return {
      submitter: this.submitterThreads.length,
      mentoring: this.mentoringThreads.length,
      approving: this.approvingThreads.length,
    };
  }

  _getSortedThreadsMap() {
    return {
      submitter: this.sortedSubmitterThreads,
      mentoring: this.sortedMentoringThreads,
      approving: this.sortedApprovingThreads,
    };
  }

  _hasThreadsForFilter(filterType) {
    const counts = this._getThreadCounts();
    return counts[filterType] > 0;
  }

  _getPrimaryThreadsForFilter(filterType) {
    const sortedThreads = this._getSortedThreadsMap();
    return sortedThreads[filterType];
  }

  _getSubmitterFallbackThreads() {
    const counts = this._getThreadCounts();
    return counts.mentoring >= counts.approving
      ? this.sortedMentoringThreads
      : this.sortedApprovingThreads;
  }

  _getMentoringFallbackThreads() {
    const counts = this._getThreadCounts();
    return counts.approving >= counts.submitter
      ? this.sortedApprovingThreads
      : this.sortedSubmitterThreads;
  }

  _getApprovingFallbackThreads() {
    const counts = this._getThreadCounts();
    return counts.mentoring >= counts.submitter
      ? this.sortedMentoringThreads
      : this.sortedSubmitterThreads;
  }

  _getFallbackThreadsForFilter(filterType) {
    const fallbackMap = {
      submitter: () => this._getSubmitterFallbackThreads(),
      mentoring: () => this._getMentoringFallbackThreads(),
      approving: () => this._getApprovingFallbackThreads(),
    };
    return fallbackMap[filterType]?.() || [];
  }

  _getFilteredThreads(filterType) {
    if (this._hasThreadsForFilter(filterType)) {
      return this._getPrimaryThreadsForFilter(filterType);
    }
    return this._getFallbackThreadsForFilter(filterType);
  }

  get displayThreads() {
    if (this.allThreads.length === 0) return [];
    if (this.currentFilter === 'all') return this.allThreads;
    return this._getFilteredThreads(this.currentFilter);
  }

  _getCounter(threads) {
    const count = threads.filter((thread) => thread.isActionNeeded).length;
    return count > 0 ? `(${count})` : '';
  }

  get submitterCounter() {
    return this._getCounter(this.submitterThreads);
  }

  get mentoringCounter() {
    return this._getCounter(this.mentoringThreads);
  }

  get approvingCounter() {
    return this._getCounter(this.approvingThreads);
  }

  fetchThreads(threadType, page, limit = this.threadsPerPage) {
    return this.store
      .query('responseThread', {
        threadType,
        page,
        limit,
      })
      .then((results) => {
        if (this.isDestroyed || this.isDestroying) return;
        const resultMeta = results.meta.meta;
        this.threads = results.toArray();
        this.meta = resultMeta;
        if (this.isLoadingNewPage) {
          this.isLoadingNewPage = false;
        }
      })
      .catch(() => {
        if (this.isDestroyed || this.isDestroying) return;
        this.isLoadingNewPage = false;
      });
  }

  @action
  showSubmitterResponses() {
    this.currentFilter = 'submitter';
  }

  @action
  showApprovingResponses() {
    this.currentFilter = 'approving';
  }

  @action
  showMentoringResponses() {
    this.currentFilter = 'mentoring';
  }

  @action
  showAllResponses() {
    this.currentFilter = 'all';
  }

  @action
  toSubmissionResponse(sub) {
    this.args.toSubmissionResponse?.(sub.id);
  }

  @action
  toResponse(submissionId, responseId) {
    this.args.toResponse?.(submissionId, responseId);
  }

  @action
  refreshList() {
    this.fetchThreads('all', 1);
  }

  @action
  initiatePageChange(page) {
    const filterMap = {
      submitter: 'submitter',
      mentoring: 'mentor',
      approving: 'approver',
    };
    const threadType = filterMap[this.currentFilter];

    this.isLoadingNewPage = true;
    this.fetchThreads(threadType, page);
  }
}
