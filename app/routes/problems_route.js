Encompass.ProblemsRoute = Ember.Route.extend({
  model: function (params) {
    var store = this.get('store');
    var problems = store.findAll('problem');
    // Filter only problems by current logged in user
    return problems;
  },

  renderTemplate: function () {
    this.render();
  }
});

