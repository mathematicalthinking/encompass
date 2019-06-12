Encompass.AuthLoginRoute = Ember.Route.extend(Encompass.MtAuthMixin,{
  beforeModel(transition) {
    transition.abort();
     window.location.href = this.getMtLoginUrlWithRedirect();
  },

  actions: {
    toHome: function() {
      window.location.href='/';
    }
  }
});
