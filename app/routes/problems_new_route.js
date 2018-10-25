Encompass.ProblemsNewRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      problems: this.get('store').findAll('problem'),
      organizations: this.get('store').findAll('organization'),
    });
  },
  renderTemplate: function () {
    this.render('problems/new');
  },
  actions: {
    toProblemInfo: function (problem) {
      this.transitionTo('problem', problem);
    },
    toProblemsHome: function () {
      this.transitionTo('problems.home');
    },
    toProblemList: function () {
      this.transitionTo('problems');
    },
  }
});


