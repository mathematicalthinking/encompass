/**
  * # Authenticated Route
  * @description This is a base route to require authentication
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.2
  */
Encompass.AuthenticatedRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super.apply(this, arguments);
    this.authenticate();
  },
  authenticate: function() { //not crazy that this is duplicated here and in ApplicationRoute
    console.log('authenticating!!!!');
    var user = this.modelFor('application');
    console.log('user in auth', user);
    if(!user.get('isAuthenticated')) {
      this.transitionTo('/');
    } else if(!user.get('isAuthz')) {
      this.transitionTo('unauthorized');
    }
  }
});
