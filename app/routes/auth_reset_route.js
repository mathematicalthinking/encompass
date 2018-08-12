Encompass.AuthResetRoute = Ember.Route.extend({
  model: function(params) {
    console.log('params in model', params);
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