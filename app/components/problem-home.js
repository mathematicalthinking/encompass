Encompass.ProblemHomeComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'problem-home',
  classNames: ['home-view'],
  showCategories: false,

  publicProblems: function () {
    var problems = this.problems.filterBy('isTrashed', false);
    var publicProblems = problems.filterBy('privacySetting', 'E');
    var sorted = publicProblems.sortBy('createDate').reverse();
    return sorted.slice(0, 10);
  }.property('problems.@each.isTrashed', 'currentUser.isStudent'),


  actions: {
    showCategories: function () {
      this.set('showCategories', !(this.get('showCategories')));
    },
  }
});
