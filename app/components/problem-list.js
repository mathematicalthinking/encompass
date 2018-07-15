Encompass.ProblemListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  yourProblemList: null,
  // currentUser: null,

  // init: function () {
  //   this._super(...arguments);
  //   let user = this.get('currentUser');
  //   this.set('currentUser', user);
  // },

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
    var yourPublic = publicProblems.filterBy('createdBy.content', !currentUser);

    //can we do the opposite filterby not currentUser

    // we want to take the 2 lists and return the difference
  //  var validList2 = _.difference(yourPublic, publicProblems);
  //  var validList = yourPublic.filter(elem => !publicProblems.includes(elem));

    // filter out public problems that are not yours, so its just globally public problems
    console.log('valid list', yourPublic);
    return yourPublic;
  })

});
