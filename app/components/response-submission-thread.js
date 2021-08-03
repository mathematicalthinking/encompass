import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  classNames: ['response-submission-thread'],
  utils: service('utility-methods'),

  statusMap: {
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
  },
  displayStatus: computed('thread.highestPriorityStatus', function () {
    let status = this.thread.highestPriorityStatus;
    return this.get('statusMap.' + status);
  }),

  displayStatusText: computed(
    'displayStatus',
    'currentCounterValue',
    function () {
      let text = this.displayStatus.display;
      return text + ' ' + this.currentCounterValue;
    }
  ),

  currentCounterValue: computed(
    'displayStatus.counterProp',
    'unreadCounter',
    'unmentoredCounter',
    'needsRevisionCounter',
    'draftCounter',
    'newlyApprovedCounter',
    'pendingApprovalCounter',
    'newRevisionCounter',
    function () {
      let prop = this.displayStatus.counterProp;
      if (!prop) {
        return '';
      }
      return this.get(prop) || '';
    }
  ),

  newRevisionCounter: computed('thread.newRevisions.[]', function () {
    let count = this.thread.newRevisions.length;

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }),

  unreadCounter: computed('unreadResponses.[]', function () {
    let count = this.thread.unreadResponses.length;

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }),

  draftCounter: computed('draftResponses.[]', function () {
    let count = this.thread.draftResponses.length;

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }),

  needsRevisionCounter: computed(
    'thread.needsRevisionResponses.[]',
    function () {
      let count = this.thread.needsRevisionResponses.length;

      if (count > 1) {
        return `(${count})`;
      }
      return '';
    }
  ),

  pendingApprovalCounter: computed(
    'thread.pendingApprovalResponses.[]',
    function () {
      let count = this.thread.pendingApprovalResponses.length;

      if (count > 1) {
        return `(${count})`;
      }
      return '';
    }
  ),

  newlyApprovedCounter: computed('thread.newlyApprovedReplies.[]', function () {
    let count = this.thread.newlyApprovedReplies.length;

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }),

  unmentoredCounter: computed('thread.unmentoredRevisions.[]', function () {
    let count = this.thread.unmentoredRevisions.length;

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }),

  mentors: computed('thread.mentors.[]', function () {
    let mentorIds = this.thread.mentors || [];
    return mentorIds
      .map((id) => {
        return this.store.peekRecord('user', id);
      })
      .compact()
      .uniq();
  }),

  ntfTitleText: computed('thread.newNtfCount', function () {
    let count = this.thread.newNtfCount;
    if (!count) {
      return '';
    }

    if (count === 1) {
      return '1 New Notification';
    }
    if (count > 1) {
      return `${count} New Notifications`;
    }
  }),

  actions: {
    toSubmissionResponse: function () {
      let response = this.thread.highestPriorityResponse;
      if (response) {
        let responseId = response.get('id');
        let submissionId = this.utils.getBelongsToId(response, 'submission');
        this.toResponse(submissionId, responseId);
      } else {
        let submission = this.thread.highestPrioritySubmission;
        if (!submission) {
          submission = this.latestRevision;
        }
        this.toSubmissionResponse(submission);
      }
    },
  },
});
