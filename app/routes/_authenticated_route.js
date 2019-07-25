/**
  * # Authenticated Route
  * @description This is a base route to require authentication
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.2
  */
Encompass.AuthenticatedRoute = Ember.Route.extend(Encompass.MtAuthMixin, {
  beforeModel: function() {
    this._super.apply(this, arguments);
    this.authenticate();
  },
  authenticate: function() { //not crazy that this is duplicated here and in ApplicationRoute
    var user = this.modelFor('application');
    if(!user.get('isAuthenticated')) {
      this.get('store').unloadAll();
      this.transitionTo('auth.login');
    }else if (!user.get('isEmailConfirmed') && !user.get('isStudent')) {
      this.transitionTo('unconfirmed');
    }else if(!user.get('isAuthz')) {
      this.transitionTo('unauthorized');
    }
  },
  actions: {
    error(error, transition) {
      let errorStatus;

      if (error && error.errors) {
        let errorObj = error.errors[0];

        if (errorObj) {
          errorStatus = errorObj.status;
        }
      }

      if (errorStatus === '401') {
        this.replaceWith('auth.login');
      } else {
        return true;
      }
    }
  }
});
