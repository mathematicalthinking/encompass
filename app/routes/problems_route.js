Encompass.ProblemsRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    let problems = this.get('store').findAll('problem');
    return problems;

  },

  renderTemplate: function () {
    this.render('problems/problems');
  }
});
