Encompass.AuthLoginRoute = Ember.Route.extend(Encompass.MtAuthMixin,{
  queryParams: 'oauthError',
  beforeModel: function(transition) {
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
