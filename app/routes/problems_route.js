Encompass.ProblemsRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      problems: this.get('store').findAll('problem'),
      currentUser: this.modelFor('application')
    });
  },

  renderTemplate: function () {
    this.render('problems/problems');
  }
});
