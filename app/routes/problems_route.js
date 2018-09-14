Encompass.ProblemsRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    return Ember.RSVP.hash({
      problems: this.get('store').findAll('problem'),
      organizations: this.get('store').findAll('organization'),
      sections: this.get('store').findAll('section'),
    });
  },

  renderTemplate: function () {
    this.render('problems/problems');
  },

});

