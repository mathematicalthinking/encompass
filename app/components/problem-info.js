Encompass.ProblemInfoComponent = Ember.Component.extend({

  actions: {
    deleteProblem: function (problem) {
      console.log('delete problem clicked');
    },
    updateProblem: function (problem) {
      console.log('update problem clicked');
    }
  }

});
