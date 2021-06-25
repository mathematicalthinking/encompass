Encompass.MetricsSubmissionController = Ember.Controller.extend({
  showSelections: false,
  showFolders: false,
  showComments: false,
  showResponses: false,
  actions: {
    handleToggle: function(prop){
      this.set('showSelections', false);
      this.set('showFolders', false);
      this.set('showComments', false);
      this.set('showResponses', false);
      this.set(prop, true);
    }
  }
});