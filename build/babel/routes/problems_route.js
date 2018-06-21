'use strict';

Encompass.ProblemsRoute = Encompass.AuthenticatedRoute.extend({
  model: function model(params) {
    var store = this.get('store');
    var problems = store.findAll('problem');
    // Filter only problems by current logged in user
    return problems;
  }
});
//# sourceMappingURL=problems_route.js.map
