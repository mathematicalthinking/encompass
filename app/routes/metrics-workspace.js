Encompass.MetricsWorkspaceRoute = Ember.Route.extend({
  actions: {
    willTransition(){
      this.controller.set('showSelections', false);
      this.controller.set('showFolders', false);
      this.controller.set('showComments', false);
      this.controller.set('showResponses', false);
      this.controller.set('showSubmissions', false);
    }
  }
});