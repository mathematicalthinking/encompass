Encompass.UserRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    var user = this.get('store').queryRecord('user', {
      username: params.username
    });
    //filter by params id
    return user;
  },

  renderTemplate: function () {
    this.render('users/user');
  }
});
