Encompass.ProblemRoute = Ember.Route.extend({
  model: function (params) {
    var problem = this.modelFor('problems').filterBy('id', params.id).get('firstObject');
    return problem;
  },

  renderTemplate: function () {
    this.render();
  }
});

