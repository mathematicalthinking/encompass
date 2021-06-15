Encompass.UsersController = Ember.Controller.extend({
  actions: {
    toUserInfo: function (user) {
      this.transitionTo('user.user', user);
    },
  }
});