Encompass.UsersNewRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    return this.store.findAll('organization');
  },
  renderTemplate: function () {
    this.render('users/new');
  },
  actions: {
    toUserInfo: function (user) {
      this.transitionTo('user', user);
    },
    toUserHome: function () {
      console.log('toUserHome called in route');
      this.transitionTo('users.home');
    },
  }
});