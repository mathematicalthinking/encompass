Encompass.LogoutRoute = Ember.Route.extend({

  beforeModel: function() {
    //$.removeCookie('EncAuth');
    window.location.href = 'logout';
  }

});
