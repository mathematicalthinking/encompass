Encompass.AuthLoginRoute = Encompass.LoggedOutRoute.extend(Encompass.MtAuthMixin,{
  queryParams: 'oauthError',
  beforeModel(transition) {
    this._super(...arguments);
    let { oauthError } = transition.queryParams;
    this.set('oauthError', oauthError);
  },

  model: function(params) {
    return {
      oauthError: this.get('oauthError'),
    };
  },

  actions: {
    toHome: function() {
      window.location.href='/';
    }
  }
});
