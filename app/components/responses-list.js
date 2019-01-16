Encompass.ResponsesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'responses-list',
  sortProperties: ['createDate'],
  sortAscending: false,
  showingAllResponses: true,
  showingOnlyMine: false,
  isShowAll: true,
  isShowMine: false,

  currentFilter: 'toUser',
  sortParam: 'newest',

  statusMap: {
    'approved': 'APPROVED',
    'pendingApproval': 'PENDING APPROVAL',
    'needsRevisions': 'NEEDS REVISIONS',
    'superceded': 'SUPERCEDED',
  },

  didReceiveAttrs() {
    this.set('filteredResponses', this.get('toUserResponses'));
    this.set('currentFilter', 'own');

    this._super(...arguments);
  },

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
      this.set('filteredResponses', this.get('toUserResponses'));
    },

    showAllResponses: function () {
      this.set('filteredResponses', this.get('nonTrashedResponses'));
      }
    },

});
