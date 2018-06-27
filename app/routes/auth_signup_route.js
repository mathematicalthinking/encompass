Encompass.AuthSignupRoute = Ember.Route.extend({
  actions: {
    toHome: function () {
      window.location.href = '/';
    }
  }
});
