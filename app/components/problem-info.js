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

    radioSelect: function (value) {
      this.set('isPublic', value);
    },

    updateProblem: function () {
      let problem = this.get('problem');
      let title = this.get('title');
      console.log('title', title);
      let text = this.get('text');
      console.log('tex', text);
      let isPublic = this.get('isPublic');

      problem.set('title', title);
      problem.set('text', text);
      problem.set('isPublic', isPublic);
      problem.save();
      this.set('isEditing', false);
    }
  }

});

