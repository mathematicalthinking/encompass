import LoggedOutRoute from './_logged_out_route';

export default LoggedOutRoute.extend({
  beforeModel() {
    this._super(...arguments);
  },

  model: function (params) {
    return params.token;
  },
  renderTemplate: function () {
    this.render('auth/reset');
  },

  actions: {
    toHome: function () {
      window.location.href = '/';
    },
  },
});
