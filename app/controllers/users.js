Encompass.UsersController = Ember.Controller.extend({
  actions: {
    toUserInfo: function (user) {
      this.transitionToRoute('user.user', user);
    },
  }
});