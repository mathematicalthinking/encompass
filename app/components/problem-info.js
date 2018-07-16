Encompass.ProblemInfoComponent = Ember.Component.extend({
  isEditing: false,
  problemName: null,
  problemQuestion: null,
  problemPublic: true,
  prob: null,
  curr: null,


  init: function () {
    this._super(...arguments);
    // this.get('problem');
    // console.log('problem', this.get('problem'));
    let curr = this.get('currentUser');
    this.set('curr', curr);
    let problem = this.get('problem');
    //let currentUser = this.get('currentUser');
    this.set('prob', problem);
    // console.log('currentUser', this.get('currentUser'));
  },

  // Check if the current problem is yours, so that you can edit it
  canEdit: Ember.computed(function() {
    let problem = this.get('problem');
    let creator = problem.get('createdBy.content.id');
    console.log('problem createdBy', creator);
    let currentUser = this.get('curr');
    console.log('currentUser id', currentUser.id);

    if (creator === currentUser.id) {
      return true;
    } else {
      return false;
    }
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
    }
  }

});

