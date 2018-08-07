Encompass.ProblemsRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    return Ember.RSVP.hash({
      problems: this.get('store').findAll('problem'),
      organizations: this.get('store').findAll('organization'),
    });
  },

  renderTemplate: function () {
    this.render('problems/problems');
  },

});

