Encompass.AuthLoginRoute = Ember.Route.extend(Encompass.MtAuthMixin,{

  actions: {
    toHome: function() {
      window.location.href='/';
    }
  }
});
