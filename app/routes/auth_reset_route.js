Encompass.AuthResetRoute = Encompass.LoggedOutRoute.extend({
  beforeModel() {
    this._super(...arguments);
  },

  model: function(params) {
    return params.token;
  },
  renderTemplate: function() {
  this.render('auth/reset');
},

actions: {
  toHome: function() {
    window.location.href='/';
  }
},
});