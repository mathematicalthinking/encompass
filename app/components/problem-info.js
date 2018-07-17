Encompass.ProblemInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  isEditing: false,
  problemName: null,
  problemQuestion: null,
  problemPublic: true,

  // We can access the currentUser using CurrentUserMixin, this is accessible because we extend it

  // Check if the current problem is yours, so that you can edit it
  canEdit: Ember.computed('problem.id', function() {
    let problem = this.get('problem');
    let creator = problem.get('createdBy.content.id');
    let currentUser = this.get('currentUser');

    let canEdit = creator === currentUser.id ? true : false;
    return canEdit;
  }),

  actions: {
    deleteProblem: function () {
      let problem = this.get('problem');
        problem.set('isTrashed', true);
        problem.save();
    },

    editProblem: function () {
      let problem = this.get('problem');
      console.log('problem title', problem.title);
      this.set('isEditing', true);
      this.set('problemName', problem.get('title'));
      this.set('problemQuestion', problem.get('text'));
      // this.set('problemPublic', problem.get('isPublic'));
    },

    radioSelect: function (value) {
      this.set('isPublic', value);
    },

    updateProblem: function () {
      let title = this.get('problemName');
      let text = this.get('problemQuestion');
      let isPublic = this.get('isPublic');

      let problem = this.get('problem');
      problem.set('title', title);
      problem.set('text', text);
      problem.set('isPublic', isPublic);
      problem.save();
      this.set('isEditing', false);
    },

    addToMyProblems: function() {
      let problem = this.get('problem');
      console.log('problem', problem.title);
    }

  }
});

