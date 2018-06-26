Encompass.ResponseRoute = Ember.Route.extend(Encompass.ConfirmLeavingRoute, {
  controllerName: 'response',

  renderTemplate: function () {
    this.render('responses/response');
  }
});
