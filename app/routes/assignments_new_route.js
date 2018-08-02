Encompass.AssignmentsNewRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      users: this.get('store').findAll('user'),
      organizations: this.get('store').findAll('organization'),
    });
  },
  renderTemplate: function () {
    this.render('assignments/new');
  },
  actions: {
    toAssignmentInfo: function(assignment) {
      this.transitionTo('assignment', assignment);
    }
  }
});