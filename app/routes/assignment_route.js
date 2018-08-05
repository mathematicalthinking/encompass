Encompass.AssignmentRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    console.log('params in assn route', params);
    return this.get('store').findRecord('assignment', params.id);

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
