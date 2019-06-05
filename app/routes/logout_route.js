Encompass.LogoutRoute = Ember.Route.extend({

  beforeModel: function() {
    // delete mtToken cookie by setting expiry date
    document.cookie = "mtToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = '/';

  }

});
