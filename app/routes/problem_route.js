Encompass.ProblemRoute = Ember.Route.extend({
  model: function (params) {
    var problem = this.modelFor('problems').filterBy('title', params.title).get('firstObject');
    return problem;
  }
});

