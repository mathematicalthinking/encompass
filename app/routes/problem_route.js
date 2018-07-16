Encompass.ProblemRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      problem: this.get('store').findRecord('problem', params.id),
      currentUser: this.modelFor('application')
    });
  },

  renderTemplate: function () {
    this.render('problems/problem');
  }
});