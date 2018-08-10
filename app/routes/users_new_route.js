Encompass.UsersNewRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      organizations: this.get('store').findAll('organization'),
    });
  },
  renderTemplate: function () {
    this.render('users/new');
  },
  actions: {
    toUserInfo: function (user) {
      this.transitionTo('user', user);
    }
  }
});
