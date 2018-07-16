Encompass.ProblemListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  yourProblemList: null,

  // This displays only the problems beloging to the current user
  yourProblems: Ember.computed(function () {
    var problems = this.problems;
    var currentUser = this.get('currentUser');
    var yourProblems = problems.filterBy('createdBy.content', currentUser);
    console.log(currentUser);
    this.set('yourProblemList', yourProblems);
    return yourProblems;
  }),

  // This sorts all the problems in the database and returns only the ones that are public
  publicProblems: Ember.computed(function () {
    var problems = this.problems;
    var currentUser = this.get('currentUser');
    var publicProblems = problems.filterBy('isPublic', true);
    var yourPublic = publicProblems.filter((el) => {
      let content = el.get('createdBy.content');
      return content.id !== currentUser.id;
    });
    return yourPublic;
  })

});

