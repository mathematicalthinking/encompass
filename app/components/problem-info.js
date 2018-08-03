Encompass.ProblemInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'problem-info',
  isEditing: false,
  problemName: null,
  problemText: null,
  problemPublic: true,
  savedProblem: null,
  isWide: false,

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
      this.set('isEditing', true);
      this.set('problemName', problem.get('title'));
      this.set('problemText', problem.get('text'));
      console.log('ProblemQuestion is currently', problem.get('text'));
      // this.set('problemPublic', problem.get('isPublic'));
    },

    radioSelect: function (value) {
      this.set('isPublic', value);
    },

    updateProblem: function () {
      let title = this.get('problemName');
      let text = this.get('problemText');
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
      let title = problem.get('title');
      let text = problem.get('text');
      let additionalInfo = problem.get('additionalInfo');
      let isPublic = problem.get('isPublic');
      let imageUrl = problem.get('imageUrl');
      let createdBy = this.get('currentUser');

      let newProblem = this.store.createRecord('problem', {
        title: title,
        text: text,
        additionalInfo: additionalInfo,
        imageUrl: imageUrl,
        isPublic: isPublic,
        origin: problem,
        createdBy: createdBy,
        createDate: new Date()
      });

      newProblem.save()
        .then((problem) => {
          this.set('savedProblem', problem);
        });
    },

    toggleImageSize: function () {
      console.log('expand image button clicked');
      this.toggleProperty('isWide');

    },

  }
});