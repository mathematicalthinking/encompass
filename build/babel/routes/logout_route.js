'use strict';

Encompass.LogoutRoute = Ember.Route.extend({

  beforeModel: function beforeModel() {
    //$.removeCookie('EncAuth');
    window.location.href = 'logout';
  }

});
//# sourceMappingURL=logout_route.js.map
