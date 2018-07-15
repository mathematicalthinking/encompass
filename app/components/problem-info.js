Encompass.ProblemInfoComponent = Ember.Component.extend({

  actions: {
    deleteProblem: function (problem) {
      problem = this.get('problem');
      console.log('problem', problem);
    },

    updateProblem: function (problem) {
      console.log('update problem clicked');
    }
  }

});

// this.get('store').findRecord('person', 1).then(function (tyrion) {
//   // ...after the record has loaded
//   tyrion.set('firstName', "Yollo");
// });