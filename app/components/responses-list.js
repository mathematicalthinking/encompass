Encompass.ResponsesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'responses-list',

  utils: Ember.inject.service('utility-methods'),

  isShowAll: Ember.computed.equal('currentFilter', 'all'),
  isShowMine: Ember.computed.equal('currentFilter', 'toUser'),
  isShowSent: Ember.computed.equal('currentFilter', 'sent'),
  isShowPending: Ember.computed.equal('currentFilter', 'pendingApproval'),
  isShowNeedsRevisions: Ember.computed.equal('currentFilter', 'needsRevisions'),

  currentFilter: 'toUser',
  sortParam: 'newest',

  areDisplayResponses: Ember.computed.gt('displayResponses.length', 0),
  areNoResponses: Ember.computed.not('areDisplayResponses'),

  statusMap: {
    'approved': 'APPROVED',
    'pendingApproval': 'PENDING APPROVAL',
    'needsRevisions': 'NEEDS REVISIONS',
    'superceded': 'SUPERCEDED',
  },

  didReceiveAttrs() {
    if (this.get('currentUser.isStudent')) {
      this.set('filteredResponses', this.get('toUserMentorCommentMessages'));
      this.set('currentFilter', 'toUser');

      return;
    }

    if (this.get('currentUser.isAdmin') || this.get('currentUser.isPdAdmin')) {
      this.set('filteredResponses', this.get('pendingResponses'));
      this.set('currentFilter', 'pendingApproval');

      return;
    }

    this.set('filteredResponses', this.get('needsRevisionsResponses'));
    this.set('currentFilter', 'needsRevisions');

    this._super(...arguments);
  },

  unreadNotes: function() {
    return this.get('toUserMentorCommentMessages').rejectBy('wasReadByRecipient');
  }.property('toUserMentorCommentMessages.@each.wasReadByRecipient'),

  unreadNotesCounter: function() {
    let count = this.get('unreadNotes.length');
    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('unreadNotes.[]'),

  pendingApprovalCounter: function() {
    let count = this.get('pendingResponses.length');
    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('pendingResponses.[]'),
  needsRevisionsCounter: function() {
    let count = this.get('needsRevisionsResponses.length');
    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('needsRevisionsResponses.[]'),
  sentCounter: function() {
    let count = this.get('sentResponses.length');
    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('sentResponses.[]'),


  showAllFilter: function() {
    return !this.get('currentUser.isStudent') && this.get('currentUser.isAdmin');
  }.property('currentUser.isStudent', 'currentUser.isAdmin'),

  showStatusColumn: function() {
    return this.get('currentFilter') === 'pendingApproval' || this.get('currentFilter') === 'needsRevisions' || this.get('currentFilter') === 'all';
  }.property('currentFilter'),

  noResponsesMessage: function() {
    let val = this.get('currentFilter');
    if (val === 'sent') {
      return `Looks like you have not created any responses. You can create one by clicking the "respond" button from a workspace.`;
    }
    if (val === 'all') {
      return 'No responses found.';
    }
    if (val === 'toUser') {
      return 'No responses addressed to you were found';
    }
    if (val === 'pendingApproval') {
      return 'There are no responses needing approval at this time.';
    }
    if (val === 'needsRevisions') {
      return 'There are no responses needing revisions at this time.';
    }
  }.property('currentFilter'),

  displayResponses: function() {
    return this.sortResponses(this.get('filteredResponses'), this.get('sortParam'));
  }.property('filteredResponses.[]', 'sortParam'),

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
  sentResponses: function() {
    return this.get('nonTrashedResponses').filter((response) => {
      let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
      return creatorId === this.get('currentUser.id') && response.get('status') === 'approved' && response.get('responseType') !== 'approver';
    });
  }.property('currentUser', 'nonTrashedResponses.[]'),

  pendingResponses: function() {
    return this.filterByStatus('pendingApproval', this.get('nonTrashedResponses'));
  }.property('nonTrashedResponses.[]'),

  needsRevisionsResponses: function() {
    return this.filterByStatus('needsRevisions', this.get('nonTrashedResponses'));
  }.property('nonTrashedResponses.[]'),

  toUserMentorCommentMessages: function() {
    return this.get('nonTrashedResponses').filter((response) => {
      let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
      return recipientId === this.get('currentUser.id') && response.get('status') === 'approved' && response.get('responseType') !== 'approver';
    });
  }.property('nonTrashedResponses.[]', 'currentUser'),

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

  actions: {
    showMyResponses: function () {
      this.set('currentFilter', 'toUser');
      this.set('filteredResponses', this.get('toUserMentorCommentMessages'));
    },

    showAllResponses: function () {
      this.set('currentFilter', 'all');
      this.set('filteredResponses', this.get('nonTrashedResponses'));
    },
    showSentResponses() {
      this.set('currentFilter', 'sent');
      this.set('filteredResponses', this.get('sentResponses'));
    },
    showPendingResponses() {
      this.set('currentFilter', 'pendingApproval');
      this.set('filteredResponses', this.get('pendingResponses'));
    },
    showNeedsRevisionResponses() {
      this.set('currentFilter', 'needsRevisions');
      this.set('filteredResponses', this.filterByStatus('needsRevisions', this.get('nonTrashedResponses')));
    },
  },

});
