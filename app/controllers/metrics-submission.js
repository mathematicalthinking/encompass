Encompass.MetricsSubmissionController = Ember.Controller.extend({
  showSelections: false,
  showFolders: false,
  showComments: false,
  showResponses: false,
  actions: {
    handleToggle: function(prop){
      this.toggleProperty(prop);
    }
  }
});