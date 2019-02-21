Encompass.ResponseSubmissionThreadComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  classNames: ['response-submission-thread'],
  utils: Ember.inject.service('utility-methods'),

  statusMap: {
    upToDate: {
      display: 'Up To Date',
      statusFill: '#35A853'
    },
    hasDraft: {
      display: 'Unfinished Draft',
      statusFill: '#778899',
      counterProp: 'draftCounter',
    },
    hasNewRevision: {
      display: 'New Revision',
      statusFill: '#3997EE',
      counterProp: 'newRevisionCounter'
    },
    hasUnmentoredRevisions: {
      display: 'Unmentored Revision',
      statusFill: '#3997EE',
      counterProp: 'unmentoredCounter'
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
      counterProp: 'needsRevisionCounter'

    },
    hasNewlyApprovedReply: {
      display: 'Newly Approved',
      statusFill: '#3997EE',
      counterProp: 'newlyApprovedCounter',
    }

  },
  displayStatus: function() {
    let status = this.get('thread.highestPriorityStatus');
    return this.get('statusMap.' + status);
  }.property('thread.highestPriorityStatus'),

  displayStatusText: function() {
    let text = this.get('displayStatus.display');
    return text + ' ' + this.get('currentCounterValue');
  }.property('displayStatus', 'currentCounterValue'),

  currentCounterValue: function() {
    let prop = this.get('displayStatus.counterProp');
    if (!prop) {
      return '';
    }
    return this.get(prop) || '';
  }.property('displayStatus.counterProp', 'unreadCounter', 'unmentoredCounter', 'needsRevisionCounter', 'draftCounter', 'newlyApprovedCounter', 'pendingApprovalCounter', 'newRevisionCounter'),

  newRevisionCounter: function() {
    let count = this.get('thread.newRevisions.length');

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }.property('thread.newRevisions.[]'),

  unreadCounter: function() {
    let count = this.get('thread.unreadResponses.length');

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }.property('unreadResponses.[]'),

  draftCounter: function() {
    let count = this.get('thread.draftResponses.length');

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }.property('draftResponses.[]'),

  needsRevisionCounter: function() {
    let count = this.get('thread.needsRevisionResponses.length');

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }.property('thread.needsRevisionResponses.[]'),

  pendingApprovalCounter: function() {
    let count = this.get('thread.pendingApprovalResponses.length');

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }.property('thread.pendingApprovalResponses.[]'),

  newlyApprovedCounter: function() {
    let count = this.get('thread.newlyApprovedReplies.length');

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }.property('thread.newlyApprovedReplies.[]'),

  unmentoredCounter: function() {
    let count = this.get('thread.unmentoredRevisions.length');

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }.property('thread.unmentoredRevisions.[]'),

 mentors: function() {
  let mentorIds = this.get('thread.mentors') || [];
  return mentorIds.map((id) => {
    return this.get('store').peekRecord('user', id);
  })
  .compact()
  .uniq();
 }.property('thread.mentors.[]'),

 ntfTitleText: function() {
  let count = this.get('thread.newNtfCount');
  if (!count) {
    return '';
  }

  if (count === 1) {
    return '1 New Notification';
  }
  if (count > 1) {
    return `${count} New Notifications`;
  }
 }.property('thread.newNtfCount'),

  actions: {
    toSubmissionResponse: function() {
      let response = this.get('thread.highestPriorityResponse');
      if (response) {
        let responseId = response.get('id');
        let submissionId = this.get('utils').getBelongsToId(response, 'submission');
        this.get('toResponse')(submissionId, responseId);
      } else {
        let submission = this.get('thread.highestPrioritySubmission');
        if (!submission) {
          submission = this.get('latestRevision');
        }
        this.get('toSubmissionResponse')(submission);
      }
    }
  }

});