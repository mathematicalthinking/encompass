Encompass.UsersNewRoute = Ember.Route.extend({
  actions: {
    toUserList: function () {
      console.log('action called in user NEW route');
      this.transitionTo('users');
    }
  }
});
