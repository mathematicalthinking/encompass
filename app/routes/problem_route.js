Encompass.ProblemRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    var problem = this.get('store').findRecord('problem', params.id);
    return problem;
  },

  renderTemplate: function () {
    this.render('problems/problem');
  }
});