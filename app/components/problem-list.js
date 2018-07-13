Encompass.ProblemListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {

  init: function () {
    this._super(...arguments);
    this.set('showMyProblems', true);
    this.publicProblems();
    this.filteredProblems();
  },

  // This sorts all the problems in the database and returns only the ones that are public
  publicProblems: function () {
    var problems = this.problems;
    var publicProblems = problems.filterBy('isPublic', true);
    console.log('public problems', publicProblems);
    return publicProblems;
  },

  // This displays only the problems beloging to the current user
  filteredProblems: function () {
    var problems = this.problems;
    console.log('All problems =', problems);
    var currentUser = this.get('currentUser');
    console.log('currentUser =', currentUser);
    var userId = currentUser.id;
    console.log('currentUserId =', userId);

    var yourProblems = problems.filterBy('createdBy', currentUser);
    console.log('your problems =', yourProblems);
    return yourProblems;
  }

});
