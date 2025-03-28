import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class UnconfirmedRoute extends Route {
  @service router;
  beforeModel() {
    // redirect to login if no user logged in
    const user = this.modelFor('application');

    if (!user || !user.get('isAuthenticated')) {
      return this.router.transitionTo('auth.login');
    }

    // redirect to home page if email is already confirmed or user does not have an email
    if (user.get('isEmailConfirmed') || !user.get('email')) {
      this.router.transitionTo('/');
    }
  }
}
