Encompass.ProblemListComponent = Ember.Component.extend({
  myProblemsOnly: [],
  showMyProblems: true,

  // filter problem list by username
  filteredComments: function () {
      var filtered = this.problems.filterBy('username');

      if (this.showMyProblems) {
        filtered = filtered.filterBy('createdBy', this.get('currentUser'));
      }
      console.log(filtered);
      return filtered;
  }
});


