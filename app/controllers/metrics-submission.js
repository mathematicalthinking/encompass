Encompass.MetricsSubmissionController = Ember.Controller.extend({
  showingSelections: false,
  actions: {
    showHighlights: function(){
      this.toggleProperty('showingSelections');
    },
  }
});