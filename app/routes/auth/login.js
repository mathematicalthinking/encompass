import LoggedOutRoute from './_logged_out_route';

export default LoggedOutRoute.extend({
  queryParams: 'oauthError',
  beforeModel(transition) {
    this._super(...arguments);
    if (transition.intent) {
      this.oauthError = transition.intent.queryParams.oauthError;
    }
  },

  model: function () {
    return {
      oauthError: this.oauthError,
    };
  },

  actions: {
    toHome: function () {
      window.location.href = '/';
    },
  },
});
