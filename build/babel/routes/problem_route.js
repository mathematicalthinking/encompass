'use strict';

Encompass.ProblemRoute = Encompass.AuthenticatedRoute.extend({
  model: function model(params) {
    var problem = this.modelFor('problems').filterBy('id', params.id).get('firstObject');
    return problem;
  },

  renderTemplate: function renderTemplate() {
    this.render();
  }
});
//# sourceMappingURL=problem_route.js.map
