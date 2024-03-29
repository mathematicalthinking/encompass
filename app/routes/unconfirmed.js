import Route from '@ember/routing/route';

export default class UnconfirmedRoute extends Route {
  beforeModel() {
    // redirect to login if no user logged in
    const user = this.modelFor('application');

    if (!user || !user.get('isAuthenticated')) {
      return this.transitionTo('auth.login');
    }

    // redirect to home page if email is already confirmed or user does not have an email
    if (user.get('isEmailConfirmed') || !user.get('email')) {
      this.transitionTo('/');
    }
  }
}
