Encompass.ResponsesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'responses-list',
  sortProperties: ['createDate'],
  sortAscending: false,

  yourResponses: Ember.computed(function () {
    let currentUser = this.get('currentUser');
    let responses = this.get('responses');
    let yourResponses = responses.filterBy('createdBy.content', currentUser);
    return yourResponses;
  }),

  // yourResponsesStudent: Ember.computed(function () {
  //   console.log('your responses list running');
  //   let currentUser = this.get('currentUser');
  //   let userType = currentUser.get('accountType');
  //   let isStudent = userType === 'S';
  //   console.log('is the user a student?', isStudent);

  //   let responses = this.store.findAll('response');
  //   let yourResponses = responses.filterBy('recipient', currentUser.id);
  //   console.log('your Responses', yourResponses);
  //   return yourResponses;
  // }),

});
