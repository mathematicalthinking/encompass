Encompass.AssignmentsNewRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      sections: this.get('store').findAll('section'),
      problems: this.get('store').findAll('problem'),
    });
  },
  renderTemplate: function () {
    this.render('assignments/new');
  },
  actions: {
    toAssignmentInfo: function(assignment) {
      this.transitionTo('assignment', assignment);
    },
    toAssignmentsHome: function() {
      this.transitionTo('assignments.home');
    }
  }
});