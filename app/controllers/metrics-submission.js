Encompass.MetricsSubmissionController = Ember.Controller.extend({
  showingSelections: false,
  actions: {
    showHighlights: function(){
      this.toggleProperty('showingSelections');
      console.log('problem', this.model.get('problem'));
      console.log('powId', this.model.get('powId'));
      console.log('workspaces', this.model.get('workspaces'));
      console.log('answer', this.model.get('answer'));
      console.log('publication', this.model.get('publication'));
      console.log('puzzle', this.model.get('puzzle'));
      let answer = this.model.get('answer');
      console.log('answer.problem', answer.get('problem'));
    },
  }
});