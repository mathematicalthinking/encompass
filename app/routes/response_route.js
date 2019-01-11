Encompass.ResponseRoute = Ember.Route.extend(Encompass.ConfirmLeavingRoute, {

  model: function(params) {
    return this.get('store').findRecord('response', params.response_id);
  },

  renderTemplate: function () {
    this.render('responses/response');
  }
});
