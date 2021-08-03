import Route from '@ember/routing/route';
import MtAuthMixin from '../../mixins/mt_auth_mixin';

/**
 * # Logged Out Route
 * @description This is a base route for routes that should only be reached by unauthenticated users, i.e. login and signup
 * @author Daniel Kelly
 * @since 1.0.2
 */
export default Route.extend(MtAuthMixin, {
  beforeModel() {
    this.authenticate();
    this._super(...arguments);
  },
  authenticate() {
    //not crazy that this is duplicated here and in ApplicationRoute
    let user = this.modelFor('application');

    if (user.get('isAuthenticated')) {
      this.transitionTo('/');
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
    },
  },
});
