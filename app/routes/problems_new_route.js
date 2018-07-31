Encompass.ProblemsNewRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      users: this.get('store').findAll('user'),
      problems: this.get('store').findAll('problem'),
      user: this.modelFor('application')
    });
  },
  renderTemplate: function () {
    this.render('problems/new');
  },
  actions: {
    toProblemInfo: function (problem) {
      this.transitionTo('problem', problem);
    }
  }
});