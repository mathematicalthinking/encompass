import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class UnconfirmedRoute extends Route {
  @service router;
  @service currentUser;
  beforeModel() {
    // redirect to login if no user logged in
    const user = this.currentUser.user;

    if (!user || !user.isAuthenticated) {
      return this.router.replaceWith('auth.login');
    }

    // redirect to home page if email is already confirmed or user does not have an email
    if (user.isEmailConfirmed || !user.email) {
      this.router.replaceWith('index');
    }
  }
}
