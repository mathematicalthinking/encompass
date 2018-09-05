Encompass.UnconfirmedRoute = Ember.Route.extend({
  beforeModel: function() {
    // redirect to home if user is confirmed or if no user logged in
    const user = this.modelFor('application');
    if ((user && user.get('isEmailConfirmed') || !user.get('isAuthenticated'))){
      this.transitionTo('/');
    }
  }
});