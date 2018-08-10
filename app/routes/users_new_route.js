Encompass.UsersNewRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    return this.store.findAll('organization');
  },
  renderTemplate: function () {
    this.render('users/new');
  },
  actions: {
    toUserInfo: function (user) {
      console.log('inside to userinfo and user is', user);
      this.transitionTo('user', user);
    }
  }
});