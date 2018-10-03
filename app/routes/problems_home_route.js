Encompass.ProblemsHomeRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      problems: this.get('store').query('problem', {
        filterBy: {
          privacySetting: 'E'
        }
      }),
      organizations: this.get('store').findAll('organization'),
      categories: this.get('store').query('category', {}),
    });
  },
  renderTemplate: function () {
    this.render('problems/home');
  },
  actions: {
  }
});
