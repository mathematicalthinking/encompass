Encompass.ProblemListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  myProblemsOnly: [],
  showMyProblems: null,


  init: function () {
    this._super(...arguments);
    this.set('showMyProblems', true);
    console.log('init ran');
    this.publicProblems();
    // this.filteredProblems();
  },

  publicProblems: function () {
    var problems = this.problems;
    problems = problems.filterBy('isPublic', true);
    console.log('problems', problems);
    return problems;
  },

  // filter problem list by username
  filteredProblems: function () {
    // var filtered = this.problems.filterBy('createdBy');
    var filtered = this.problems;
    // console.log('problems', this.problems);
    // console.log('filtered comments ran');
    console.log('filtered =', filtered);
    console.log(this.get('currentUser'));

    if (this.showMyProblems) {
      filtered = filtered.filterBy('createdBy', this.get('currentUser'));
    }
    console.log(filtered);
    return filtered;
  }

//We want to sort the Public problems by isPublic true

});


