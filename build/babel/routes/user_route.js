'use strict';

Encompass.UserRoute = Ember.Route.extend({

  model: function model(params) {
    var user = this.modelFor('users').filterBy('username', params.username).get('firstObject');
    return user;
  }

});
//# sourceMappingURL=user_route.js.map
