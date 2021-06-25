Encompass.MetricsProblemRoute = Ember.Route.extend({
  actions: {
    willTransition(){
      this.controller.set('showProblemText', false);
      this.controller.set('relevantWorkspaces', []);
      this.controller.set('problemAnswers', []);
    }
  }
});