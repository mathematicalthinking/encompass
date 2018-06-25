Encompass.UserRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    var user = this.modelFor('users').filterBy('username', params.id).get('firstObject');
    return user;
  },

  renderTemplate: function () {
    this.render('users/user');
  }
});
