Encompass.MetricsProblemRoute = Ember.Route.extend({
  actions: {
    willTransition(){
      this.controller.set('showProblemText', false);
      this.controller.set('problemSubmissions', []);
    }
  }
});