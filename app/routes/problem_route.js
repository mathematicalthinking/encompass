Encompass.ProblemRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    var problem = this.modelFor('problems').filterBy('id', params.id).get('firstObject');
    return problem;
  },

  renderTemplate: function () {
    this.render('problems/problem');
  }
});