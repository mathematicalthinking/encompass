Encompass.AssignmentRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      assignment: this.get('store').findRecord('assignment', params.id),
      answers: this.get('store').findAll('answer'),
    });
  },

  actions: {
    toAnswerInfo: function(answer) {
      console.log('in toAnswerInfo');
      this.transitionTo('answer', answer);
    }
  },

  renderTemplate: function () {
    this.render('assignments/assignment');
  }
});
