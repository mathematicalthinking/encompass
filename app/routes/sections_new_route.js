Encompass.SectionsNewRoute = Encompass.AuthenticatedRoute.extend({
    model: function (params) {
      return Ember.RSVP.hash({
        users: this.get('store').findAll('user'),
        organizations: this.get('store').findAll('organization'),
        user: this.modelFor('application')
      });
    },
    renderTemplate: function () {
      this.render('sections/new');
    }
  });