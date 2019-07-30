Encompass.AuthForgotRoute = Encompass.LoggedOutRoute.extend({
  beforeModel() {
    this._super(...arguments);
  }
});