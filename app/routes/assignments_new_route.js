Encompass.AssignmentsNewRoute = Encompass.AuthenticatedRoute.extend({
  beforeModel: function() {
    this._super.apply(this, arguments);

    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.transitionTo('assignments');
    }
  },

  model: function (params) {
    return Ember.RSVP.hash({
      sections: this.get('store').findAll('section'),
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
      this.transitionTo('assignments');
    }
  }
});