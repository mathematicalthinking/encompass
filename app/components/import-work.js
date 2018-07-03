Encompass.ImportWorkComponent = Ember.Component.extend({
  selectedProblem: null,
  selectedSection: null,
  selectedFiles: null,
  isCreatingNewProblem: null,
  problems: null,
  sections: null,

  didInsertElement: function() {
    console.log('inserted element');
    this.set('problems', this.model.problems);
    this.set('sections', this.model.sections);
  },
  actions: {
    toggleNewProblem: function() {
      if (this.get('isCreatingNewProblem') !== true) {
        this.set('isCreatingNewProblem', true);
      } else {
        this.set('isCreatingNewProblem', false);
      }
    }
  }
});