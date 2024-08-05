import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class MyRoute extends Route {
  @service mtAuth;
  @service store;
  @service router;

  beforeModel(transition) {
    super.beforeModel(transition);

    this.authenticate();
  }

  authenticate() {
    //not crazy that this is duplicated here and in ApplicationRoute
    let user = this.modelFor('application');
    if (!user.isAuthenticated) {
      this.store.unloadAll();
      this.router.transitionTo('auth.login');
    } else if (user.email && !user.isEmailConfirmed && !user.isStudent) {
      this.router.transitionTo('unconfirmed');
    } else if (!user.isAuthz) {
      this.router.transitionTo('unauthorized');
    }
  }

  @action
  error(error, transition) {
    let errorStatus;

    if (error && error.errors) {
      let errorObj = error.errors[0];

      if (errorObj) {
        errorStatus = errorObj.status;
      }
    }

    if (errorStatus === '401') {
      this.router.replaceWith('auth.login');
    } else {
      // Allow the route to handle the error
      return true;
    }
  }
}
