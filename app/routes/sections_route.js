
Encompass.SectionsRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    return Ember.RSVP.hash({
      sections: this.get('store').findAll('section'),
      currentUser: this.modelFor('application')
    });
  },
});
