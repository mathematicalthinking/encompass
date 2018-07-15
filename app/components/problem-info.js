Encompass.ProblemInfoComponent = Ember.Component.extend({
  isEditing: false,

  actions: {
    deleteProblem: function () {
      let problem = this.get('problem');
        problem.set('isTrashed', true);
        problem.save();
    },

    editProblem: function () {
      this.set('isEditing', true);
    },

    updateProblem: function () {
      let problem = this.get('problem');
      let name = this.get('title');
      let question = this.get('text');
      let isPublic = this.get('isPublic');

      problem.set('title', name);
      problem.set('text', question);
      problem.set('isPublic', isPublic);
      problem.save();
      this.set('isEditing', false);
    }
  }

});

