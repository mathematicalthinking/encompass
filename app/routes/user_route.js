Encompass.UserRoute = Ember.Route.extend({

  model: function(params) {
    var user = this.modelFor('users').filterBy('username', params.username).get('firstObject');
    return user;
  },

});
