Encompass.AssignmentRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    console.log('params in assn route', params);
    return this.get('store').findRecord('assignment', params.assignmentId);

  },

  actions: {
    toAnswerInfo: function(answer) {
      this.transitionTo('answer', answer);
    },
    toAssignments: function() {
      this.transitionTo('assignments.home');
    }
  },

  renderTemplate: function () {
    this.render('assignments/assignment');
  }
});
