Encompass.AssignmentsNewRoute = Encompass.AuthenticatedRoute.extend({
  beforeModel: function() {
    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.transitionTo('assignments.home');
    }
  },

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