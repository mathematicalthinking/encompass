Encompass.ProblemListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'problem-list',
  classNames: ['problem-list', 'left-list'],
  yourProblemList: null,


  // This displays only the problems beloging to the current user
  yourProblems: function () {
    var problems = this.problems.filterBy('isTrashed', false);
    var currentUser = this.get('currentUser');
    var yourProblems = problems.filterBy('createdBy.content', currentUser);
    this.set('yourProblemList', yourProblems);
    return yourProblems.sortBy('createDate').reverse();
  }.property('problems.@each.isTrashed', 'currentUser.isStudent'),

  // This displays only the problems beloging to the current user's organizaton
  orgProblems: function () {
    var problems = this.problems.filterBy('isTrashed', false);
    var currentUser = this.get('currentUser');
    var orgProblems = problems.filterBy('privacySetting', 'O');
    var yourOrg = orgProblems.filter((el) => {
      let content = el.get('createdBy.content');
      return content.id !== currentUser.id;
    });
    return yourOrg.sortBy('createDate').reverse();
  }.property('problems.@each.isTrashed', 'currentUser.isStudent'),

  // This sorts all the problems that are visible to everyone
  publicProblems: function () {
    var problems = this.problems.filterBy('isTrashed', false);
    var currentUser = this.get('currentUser');
    var publicProblems = problems.filterBy('privacySetting', 'E');
    var yourPublic = publicProblems.filter((el) => {
      let content = el.get('createdBy.content');
      return content.id !== currentUser.id;
    });
    return yourPublic.sortBy('createDate').reverse();
  }.property('problems.@each.isTrashed', 'currentUser.isStudent'),

});

