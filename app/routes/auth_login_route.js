Encompass.AuthLoginRoute = Ember.Route.extend(Encompass.MtAuthMixin,{
  beforeModel() {
     window.location.href = this.getMtLoginUrlWithRedirect();
  },

  actions: {
    toHome: function() {
      window.location.href='/';
    }
  }
});
