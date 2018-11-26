Encompass.UnauthorizedRoute = Ember.Route.extend({
  beforeModel: function() {
    // redirect to home if user is authorized or if no user logged in
    const user = this.modelFor('application');
    if ((user && user.get('isAuthz') || !user.get('isAuthenticated'))){
      this.transitionTo('/');
    }
  },

  model: function() {
    let user = this.modelFor('application');
    if (user.get('needAdditionalInfo')) {
      return this.store.findAll('organization');
    }
    return;

  },

  actions: {
    toHome: function () {
      window.location.href = '/';
    }
  }
});
