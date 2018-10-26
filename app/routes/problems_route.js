Encompass.ProblemsRoute = Encompass.AuthenticatedRoute.extend({

  hideOutlet: true,

  beforeModel: function(transition) {
    let problemId;
    let params = transition.params;
    if (params.problem) {
      problemId = params.problem.problemId;
    }
    if (problemId) {
      this.set('hideOutlet', false);
    } else {
      if (!this.get('hideOutlet')) {
        this.set('hideOutlet', true);
      }
    }

    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.transitionTo('/');
    }
  },
  model: function (params) {
    const store = this.get('store');
    const user = this.modelFor('application');
    let problemCriteria = {};

    if (!user.get('isAdmin')) {
      problemCriteria = {
        filterBy: {
          createdBy: user.id
        }
      };
    }
    return Ember.RSVP.hash({
      organizations: store.findAll('organization'),
      sections: store.findAll('section'),
      problems: store.query('problem', problemCriteria),
      hideOutlet: this.get('hideOutlet')
    });
  },

  renderTemplate: function () {
    this.render('problems/problems');
  },
  actions: {
    toProblemInfo(problem) {
      this.transitionTo('problem', problem);
    }
  }

});

