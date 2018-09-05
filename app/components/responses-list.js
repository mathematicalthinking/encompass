Encompass.ResponsesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'responses-list',
  sortProperties: ['createDate'],
  sortAscending: false,
  showingAllResponses: true,
  showingOnlyMine: false,
  isShowAll: true,
  isShowMine: false,

  allResponses: Ember.computed(function () {
    let responses = this.get('responses');
    return responses.sortBy('createDate').reverse();
  }),

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
      this.set('showingOnlyMine', true);
      this.set('showingAllResponses', false);
      this.set('isShowAll', false);
      this.set('isShowMine', true);
    },

    showAllResponses: function () {
      this.set('showingOnlyMine', false);
      this.set('showingAllResponses', true);
      this.set('isShowAll', true);
      this.set('isShowMine', false);
      }
    },

});
