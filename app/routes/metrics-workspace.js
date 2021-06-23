Encompass.MetricsWorkspaceRoute = Ember.Route.extend({
  actions: {
    willTransition(){
      this.controller.set('heading', null);
      this.controller.set('content', null);
    }
  }
});