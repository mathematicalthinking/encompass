Encompass.UserRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    var user = this.get('store').findRecord('user', params.id);
    return user;
  },

  renderTemplate: function () {
    this.render('users/user');
  }
});
