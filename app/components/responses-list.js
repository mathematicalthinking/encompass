Encompass.ResponsesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'responses-list',
  sortProperties: ['createDate'],
  sortAscending: false,
  showingAllResponses: true,
  showingOnlyMine: false,

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
    toggleYourRespones: function () {
      console.log('clicked on toggle');
      let showing = this.get('showingAllResponses');
      console.log('showing is', showing);
      if (showing) {
        this.set('showingOnlyMine', true);
        this.set('showingAllResponses', false);
      } else {
        this.set('showingOnlyMine', false);
        this.set('showingAllResponses', true);
      }
    },
  }

});
