Encompass.ProblemHomeComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'problem-home',
  classNames: ['home-view'],

  publicProblems: function () {
    var problems = this.problems.filterBy('isTrashed', false);
    var publicProblems = problems.filterBy('privacySetting', 'E');
    return publicProblems.sortBy('createDate').reverse();
  }.property('problems.@each.isTrashed', 'currentUser.isStudent'),


  actions: {
  }
});
