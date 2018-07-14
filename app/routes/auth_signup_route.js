Encompass.AuthSignupRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('organization');
  },

  actions: {
    toHome: function () {
      window.location.href = '/';
    }
  }
});
