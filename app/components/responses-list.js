Encompass.ResponsesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'responses-list',

  utils: Ember.inject.service('utility-methods'),
  isShowAll: Ember.computed.equal('currentFilter', 'all'),
  isShowSubmitter: Ember.computed.equal('currentFilter', 'submitter'),
  isShowMentoring: Ember.computed.equal('currentFilter', 'mentoring'),
  isShowApproving: Ember.computed.equal('currentFilter', 'approving'),

  currentFilter: 'submitter',
  sortParam: 'newest',

  areDisplayResponses: Ember.computed.gt('displayResponses.length', 0),
  areNoResponses: Ember.computed.not('areDisplayResponses'),
  noResponsesMessage: 'No responses found',

  showStudentColumn: Ember.computed.equal('isShowMentoring', true),

  statusMap: {
    'approved': 'APPROVED',
    'pendingApproval': 'PENDING APPROVAL',
    'needsRevisions': 'NEEDS REVISIONS',
    'superceded': 'SUPERCEDED',
  },

  submitterThreads: function() {
    let hash = {};
    this.get('submitterResponses').forEach((response) => {
      let subId = this.get('utils').getBelongsToId(response, 'submission');
      if (!hash[subId]) {
        hash[subId] = [response];
      } else {
        hash[subId].addObject(response);
      }
    });
    return hash;
  }.property('submitterResponses.[]'),

  mentoringThreads: function() {
    let hash = {};
    this.get('mentoringResponses').forEach((response) => {
      let subId = this.get('utils').getBelongsToId(response, 'submission');
      if (!hash[subId]) {
        hash[subId] = [response];
      } else {
        hash[subId].addObject(response);
      }
    });
    return hash;
  }.property('mentoringResponses.[]'),

  approvingThreads: function() {
    let hash = {};
    this.get('approvingResponses').forEach((response) => {
      let subId = this.get('utils').getBelongsToId(response, 'submission');
      if (!hash[subId]) {
        hash[subId] = [response];
      } else {
        hash[subId].addObject(response);
      }
    });
    return hash;
  }.property('approvingResponses.[]'),


  areAnyActionItems: function() {
    return this.get('submitterActions.length') > 0 || this.get('mentoringActionItems.length') > 0 || this.get('approvingActionItems.length') > 0;
  }.property('submitterActionItems.[]', 'mentoringActionItems.[]', 'approvingActionItems.[]'),

  didReceiveAttrs() {

    let list = [
      {name: 'sortedSubmitterResponses', actionCount : this.get('submitterActionItems.length'), allCount: this.get('submitterResponses.length'), currentFilter: 'submitter'},
      {name: 'sortedMentoringResponses', actionCount: this.get('mentoringActionItems.length'), allCount: this.get('mentoringResponses.length'), currentFilter: 'mentoring'},
      {name: 'sortedApprovingResponses', actionCount: this.get('approvingActionItems.length'), allCount: this.get('approvingResponses.length'), currentFilter: 'approving'}
    ];

    // ascending
    let sorted = list.sortBy('actionCount', 'allCount');

    this.set('filteredResponses', this.get(sorted[2].name));
    this.set('currentFilter', sorted[2].currentFilter);

    this._super(...arguments);
  },

  showSubmitterTab: Ember.computed.gt('submitterResponses.length', 0),
  showMentoringTab: Ember.computed.gt('mentoringResponses.length', 0),
  showApprovingTab: Ember.computed.gt('approvingResponses.length', 0),

  submitterActionItems: function() {
    return this.get('submitterResponses').rejectBy('wasReadByRecipient');
  }.property('submitterResponses.@each.wasReadByRecipient'),

  mentoringActionItems: function() {
    return this.get('mentoringResponses').filter((response) => {
      return !response.get('wasReadByRecipient') && response.get('status') === 'needsRevisions';
    });
  }.property('mentoringResponses.@each.{wasReadByRecipient,status}'),
  approvingActionItems: function() {
    return this.get('approvingResponses').filter((response) => {
      return !response.get('wasReadByRecipient') && response.get('status') === 'pendingApproval';
    });
  }.property('approvingResponses.@each.{wasReadByRecipient,status}'),

  submitterCounter: function() {
    let count = this.get('submitterActionItems.length');

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('submitterActionItems.[]'),

  mentoringCounter: function() {
    let count = this.get('mentoringActionItems.length');

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('mentoringActionItems.[]'),

  approvingCounter: function() {
    let count = this.get('approvingActionItems.length');

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('approvingActionItems.[]'),

  showAllFilter: function() {
    return !this.get('currentUser.isStudent') && this.get('currentUser.isAdmin');
  }.property('currentUser.isStudent', 'currentUser.isAdmin'),

  showStatusColumn: function() {
    return this.get('currentFilter') === 'mentoring' || this.get('currentFilter') === 'approving' || this.get('currentFilter') === 'all';
  }.property('currentFilter'),

  displayResponses: function() {
    return this.get('filteredResponses');
  }.property('filteredResponses.[]'),

  sortResponses(responses, sortParam) {
    if (!responses) {
      return [];
    }
    if (sortParam === 'newest' || !sortParam) {
      return responses.sortBy('createDate').reverse();
    }

    return responses.sortBy('createDate');
  },
  nonTrashedResponses: function() {
    return this.get('responses').rejectBy('isTrashed');
  }.property('responses.@each.isTrashed'),

  filterByStatus(status, responses) {
    if (!this.get(`statusMap.${status}`)) {
      return responses;
    }
    if (!responses) {
      return [];
    }
    return responses.filterBy('status', status);
  },

  filterByRecipient(recipientId, responses) {
    if (!recipientId) {
      return responses;
    }

    if (!responses) {
      return [];
    }

    return responses.filter((response) => {
      let recipId = response.belongsTo('recipient').id();
      return recipId === recipientId;
    });

  },

  filterByCreatedBy(creatorId, responses ) {
    if (!creatorId) {
      return responses;
    }

    if (!responses) {
      return [];
    }

    return responses.filter((response) => {
      let id = response.belongsTo('createdBy').id();
      return creatorId === id;
    });
  },

  submitterResponses: function() {
    return this.get('nonTrashedResponses').filter((response) => {
      let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
      return recipientId === this.get('currentUser.id') && response.get('status') === 'approved' && response.get('responseType') === 'mentor';
    });
  }.property('nonTrashedResponses.[]', 'currentUser'),

  mentoringResponses: function() {
    return this.get('nonTrashedResponses').filter((response) => {
      let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
      let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
      let isByYou = creatorId === this.get('currentUser.id');
      let isToYou = recipientId === this.get('currentUser.id');

      let isYourMentorReply = isByYou && response.get('responseType') === 'mentor';
      let isApproverNote = isToYou && response.get('isApproverNoteOnly');
      let isNewRevisionNotice = isToYou && response.get('responseType') === 'newRevisionNotice';

      return isYourMentorReply || isApproverNote || isNewRevisionNotice;
    });
  }.property('nonTrashedResponses.[]', 'currentUser'),

  approvingResponses: function() {
    return this.get('nonTrashedResponses').filter((response) => {
      let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
      let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
      let approvedById = this.get('utils').getBelongsToId(response, 'approvedBy');

      let isByYou = creatorId === this.get('currentUser.id');
      let isToYou = recipientId === this.get('currentUser.id');

      let wasApprovedByYou = approvedById === this.get('currentUser.id');
      let isYourApproverReply = isByYou && response.get('responseType') === 'approver';
      let needsApproval = response.get('status') === 'pendingApproval';
      let isReplyToApprove = (!isToYou && !isByYou) && needsApproval;

      return isReplyToApprove || isYourApproverReply || wasApprovedByYou;
    });
  }.property('nonTrashedResponses.[]', 'currentUser'),

  sortedAllResponses: function() {
    return this.get('nonTrashedResponses').sort((a, b) => {
      let isAUnread = this.isResponseUnread(a, this.get('currentUser.id'));
      let isBUnread = this.isResponseUnread(b, this.get('currentUser.id'));

      if (isAUnread && !isBUnread) {
        return -1;
      }

      if (isBUnread && !isAUnread) {
        return 1;
      }

      // both unread , sort newest first
      let momentA = moment(a.get('createDate'));
      let momentB = moment(b.get('createDate'));

      let diff = momentA.diff(momentB);

      if (diff > 0) {
        return -1;
      }
      if (diff < 0) {
        return 1;
      }
      return 0;
    });
  }.property('nonTrashedResponses.[]'),

  sortedSubmitterResponses: function() {
    return this.get('submitterResponses').sort((a, b) => {
      let isAUnread = this.isResponseUnread(a, this.get('currentUser.id'));
      let isBUnread = this.isResponseUnread(b, this.get('currentUser.id'));

      if (isAUnread && !isBUnread) {
        return -1;
      }

      if (isBUnread && !isAUnread) {
        return 1;
      }

      // both unread , sort newest first
      let momentA = moment(a.get('createDate'));
      let momentB = moment(b.get('createDate'));

      let diff = momentA.diff(momentB);

      if (diff > 0) {
        return -1;
      }
      if (diff < 0) {
        return 1;
      }
      return 0;
    });
  }.property('submitterResponses.[]'),

  sortedApprovingResponses: function() {
    return this.get('approvingResponses').sort((a, b) => {
      let isAUnread = this.isResponseUnread(a, this.get('currentUser.id'));
      let isBUnread = this.isResponseUnread(b, this.get('currentUser.id'));

      if (isAUnread && !isBUnread) {
        return -1;
      }

      if (isBUnread && !isAUnread) {
        return 1;
      }

      let isADraft = a.get('status') === 'draft';
      let isBDraft = b.get('status') === 'draft';

      if (isADraft && !isBDraft) {
        return -1;
      }
      if (isBDraft && !isADraft) {
        return 1;
      }
      // both unread or both read , sort  by pending first

      let isAPendingApproval = a.get('status') === 'pendingApproval';
      let isBPendingApproval = b.get('status') === 'pendingApproval';

      if (isAPendingApproval && !isBPendingApproval) {
        return -1;
      }

      if (isBPendingApproval && !isAPendingApproval) {
        return 1;
      }

      // both pending or both not pending, sort by newest first

      let momentA = moment(a.get('createDate'));
      let momentB = moment(b.get('createDate'));

      let diff = momentA.diff(momentB);

      if (diff > 0) {
        return -1;
      }
      if (diff < 0) {
        return 1;
      }
      return 0;
    });
  }.property('approvingResponses.[]'),

  sortedMentoringResponses: function() {
    return this.get('mentoringResponses').sort((a, b) => {
      let isAUnread = this.isResponseUnread(a, this.get('currentUser.id'));
      let isBUnread = this.isResponseUnread(b, this.get('currentUser.id'));

      let isANoteOnly = a.get('isApproverNoteOnly');
      let isBNoteOnly = b.get('isApproverNoteOnly');

      let doesANeedsRevisions = a.get('status') === 'needsRevisions';
      let doesBNeedRevisions = b.get('status') === 'needsRevisions';

      let isADraft = a.get('status') === 'draft';
      let isBDraft = b.get('status') === 'draft';

      if (isAUnread && !isBUnread) {
        // sort action items before unread notes
        if (isANoteOnly && (doesBNeedRevisions || isBDraft)) {
          return 1;
        }
        return -1;
      }

      if (isBUnread && !isAUnread) {
        if (isBNoteOnly && (doesANeedsRevisions || isADraft)) {
          return -1;
        }
        return 1;
      }

      // both unread or both read , sort needsRevisiosn first

      if (doesANeedsRevisions && !doesBNeedRevisions) {
        return -1;
      }

      if (doesBNeedRevisions && !doesANeedsRevisions) {
        return 1;
      }

      // both need revisions or both dont need revisions, sort by newest first

      let momentA = moment(a.get('createDate'));
      let momentB = moment(b.get('createDate'));

      let diff = momentA.diff(momentB);

      if (diff > 0) {
        return -1;
      }
      if (diff < 0) {
        return 1;
      }
      return 0;
    });
  }.property('mentoringResponses'),
  isResponseUnread(response, userId) {
    if (!userId) {
      userId = this.get('currentUser.id');
    }

    if (!response || !userId) {
      return;
    }
    let recipientRef = response.belongsTo('recipient');
    let recipientId;

    if (recipientRef) {
      recipientId = recipientRef.id();
    }

    return !response.get('wasReadByRecipient') && userId === recipientId;
  },
  actions: {
    showSubmitterResponses() {
      this.set('currentFilter', 'submitter');
      this.set('filteredResponses', this.get('sortedSubmitterResponses'));
    },
    showApprovingResponses() {
      this.set('currentFilter', 'approving');
      this.set('filteredResponses', this.get('sortedApprovingResponses'));
    },
    showMentoringResponses() {
      this.set('currentFilter', 'mentoring');
      this.set('filteredResponses', this.get('sortedMentoringResponses'));
    },
    showAllResponses() {
      this.set('currentFilter', 'all');
      this.set('filteredResponses', this.get('sortedAllResponses'));

    }
  },

});
