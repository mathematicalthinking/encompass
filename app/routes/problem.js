import AuthenticatedRoute from './_authenticated_route';

export default AuthenticatedRoute.extend({
  model: function (params) {
    var problem = this.store.findRecord('problem', params.problem_id);
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
    },
  },
});
