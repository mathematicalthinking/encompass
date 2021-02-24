  /**
  * # Index Route
  * @description This is a base route for the application index which renders home-page and dashboard components
  * @author Crispina Muriel
  * @since 2.3.0
  */
Encompass.IndexRoute = Ember.Route.extend({
    beforeModel: function() {
    this._super.apply(this, arguments);
    this.authenticate();
  },
  authenticate: function() { //this is duplicated here,AuthentecatedRoute, and in ApplicationRoute
    var user = this.modelFor('application');
    if(!user.get('isAuthenticated')) {
      this.get('store').unloadAll();
      this.transitionTo('auth.login');
    }else if (user.get('email') && !user.get('isEmailConfirmed') && !user.get('isStudent')) {
      this.transitionTo('unconfirmed');
    }else if(!user.get('isAuthz')) {
      this.transitionTo('unauthorized');
    }
  },
  model: function () {
    let user = this.modelFor('application');
    let assignments = this.get("store").findAll("assignment");
    return { "assignments": assignments, "user": user};
  },
  renderTemplate: function () {
    this.render("index");
  },
});
