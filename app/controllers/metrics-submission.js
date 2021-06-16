Encompass.MetricsSubmissionController = Ember.Controller.extend({
  showSelections: false,
  showFolders: false,
  showComments: false,
  actions: {
    handleToggle: function(prop){
      this.toggleProperty(prop);
    }
  }
});