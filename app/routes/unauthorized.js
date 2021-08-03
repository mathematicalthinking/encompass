import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel: function () {
    // redirect to login if no user logged in
    const user = this.modelFor('application');

    if (!user || !user.get('isAuthenticated')) {
      return this.transitionTo('auth.login');
    }
    // redirect to confirm email info page if
    // email still needs confirming
    let doesEmailNeedConfirming =
      !user.get('isEmailConfirmed') &&
      user.get('email') &&
      !user.get('isStudent');

    if (doesEmailNeedConfirming) {
      return this.transitionTo('unconfirmed');
    }

    // redirect to home page if already authorized
    if (user.get('isAuthz')) {
      this.transitionTo('/');
    }
  },

  model: function () {
    let user = this.modelFor('application');
    if (user.get('needAdditionalInfo')) {
      return this.store.findAll('organization');
    }
    return;
  },

  actions: {
    toHome: function () {
      window.location.href = '/';
    },
  },
});
