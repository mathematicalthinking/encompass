import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ResponseSubmissionThreadComponent extends Component {
  @service('utility-methods') utils;

  statusMap = {
    upToDate: {
      display: 'Up To Date',
      statusFill: '#35A853',
    },
    hasDraft: {
      display: 'Unfinished Draft',
      statusFill: '#778899',
      counterProp: 'draftCounter',
    },
    hasNewRevision: {
      display: 'New Revision',
      statusFill: '#3997EE',
      counterProp: 'newRevisionCounter',
    },
    hasUnmentoredRevisions: {
      display: 'Unmentored Revision',
      statusFill: '#3997EE',
      counterProp: 'unmentoredCounter',
    },
    hasUnreadReply: {
      display: 'Unread Reply',
      statusFill: '#3997EE',
      counterProp: 'unreadCounter',
    },
    isWaitingForApproval: {
      display: 'Pending Approval',
      statusFill: '#FFD204',
      counterProp: 'pendingApprovalCounter',
    },
    inNeedOfRevisions: {
      display: 'Needs Revisions',
      statusFill: '#EB5757',
      counterProp: 'needsRevisionCounter',
    },
    hasNewlyApprovedReply: {
      display: 'Newly Approved',
      statusFill: '#3997EE',
      counterProp: 'newlyApprovedCounter',
    },
  };

  get displayStatus() {
    const status = this.args.thread?.highestPriorityStatus;
    return this.statusMap[status];
  }

  get displayStatusText() {
    const text = this.displayStatus?.display || '';
    return text + ' ' + this.currentCounterValue;
  }

  get currentCounterValue() {
    const prop = this.displayStatus?.counterProp;
    if (!prop) {
      return '';
    }
    return this[prop] || '';
  }

  _getCounter(items) {
    const count = items?.length || 0;
    return count > 1 ? `(${count})` : '';
  }

  get newRevisionCounter() {
    return this._getCounter(this.args.thread?.newRevisions);
  }

  get unreadCounter() {
    return this._getCounter(this.args.thread?.unreadResponses);
  }

  get draftCounter() {
    return this._getCounter(this.args.thread?.draftResponses);
  }

  get needsRevisionCounter() {
    return this._getCounter(this.args.thread?.needsRevisionResponses);
  }

  get pendingApprovalCounter() {
    return this._getCounter(this.args.thread?.pendingApprovalResponses);
  }

  get newlyApprovedCounter() {
    return this._getCounter(this.args.thread?.newlyApprovedReplies);
  }

  get unmentoredCounter() {
    return this._getCounter(this.args.thread?.unmentoredRevisions);
  }

  get ntfTitleText() {
    const count = this.args.thread?.newNtfCount;
    if (!count) {
      return '';
    }
    return count === 1 ? '1 New Notification' : `${count} New Notifications`;
  }

  @action
  toSubmissionResponse() {
    const response = this.args.thread?.highestPriorityResponse;
    if (response) {
      const responseId = response.id;
      const submissionId = this.utils.getBelongsToId(response, 'submission');
      this.args.toResponse?.(submissionId, responseId);
    } else {
      const submission =
        this.args.thread?.highestPrioritySubmission ||
        this.args.thread?.latestRevision;
      this.args.toSubmissionResponse?.(submission);
    }
  }
}
