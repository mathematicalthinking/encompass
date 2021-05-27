Encompass.AssignmentRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    return this.get('store').findRecord('assignment', params.assignmentId);

  },

  actions: {
    toAnswerInfo: function(answer) {
      this.transitionTo('answer', answer);
    },
    toAssignments: function() {
      this.transitionTo('assignments');
    }
  },

  renderTemplate: function () {
    this.render('assignments/assignment');
  }
});
