Encompass.ProblemRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    var problem = this.get('store').findRecord('problem', params.problemId);
    return problem;
  },

  renderTemplate: function () {
    this.render('problems/problem');
  },

  actions: {
    toProblemList: function () {
      this.transitionTo('problems');
    },
    toAssignmentInfo: function (assignment) {
      this.transitionTo('assignment', assignment);
    }
  }
});