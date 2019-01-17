Encompass.ResponsesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'responses-list',
  sortProperties: ['createDate'],
  sortAscending: false,
  showingAllResponses: true,
  showingOnlyMine: false,
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
    this.set('filteredResponses', this.get('toUserResponses'));
    this.set('currentFilter', 'toUser');

    this._super(...arguments);
  },

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

  toUserResponses: function () {
   return this.filterByRecipient(this.get('currentUser.id'), this.get('nonTrashedResponses'));
  }.property('currentUser', 'nonTrashedResponses.[]'),

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

  yourResponses: Ember.computed(function () {
    let currentUser = this.get('currentUser');
    let responses = this.get('responses');
    let yourResponses = responses.filterBy('createdBy.content', currentUser);
    return yourResponses.sortBy('createDate').reverse();
  }),

  responsesStudent: Ember.computed(function () {
    let currentUser = this.get('currentUser');
    let responses = this.get('responses');
    let responsesStudent = responses.filterBy('recipient.content', currentUser);
    return responsesStudent.sortBy('createDate').reverse();
  }),

  actions: {
    showMyResponses: function () {
      this.set('currentFilter', 'toUser');
      this.set('filteredResponses', this.get('toUserResponses'));
    },

    showAllResponses: function () {
      this.set('currentFilter', 'all');
      this.set('filteredResponses', this.get('nonTrashedResponses'));
    },
      showSentResponses() {
        this.set('currentFilter', 'sent');
        this.set('filteredResponses', this.filterByCreatedBy(this.get('currentUser.id'), this.get('nonTrashedResponses')));
      },
      showPendingResponses() {
        this.set('currentFilter', 'pendingApproval');
        this.set('filteredResponses', this.filterByStatus('pendingApproval', this.get('nonTrashedResponses')));
      },
      showNeedsRevisionResponses() {
        this.set('currentFilter', 'needsRevisions');
        this.set('filteredResponses', this.filterByStatus('needsRevisions', this.get('nonTrashedResponses')));
      },

    },

});
