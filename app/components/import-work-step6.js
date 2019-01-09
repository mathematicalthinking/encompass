/*global _:false */
Encompass.ImportWorkStep6Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step6',

  shouldHideButtons: function () {
    if (this.get('isUploadingAnswer') || this.get('isCreatingWorkspace') || this.get('savingAssignment') || this.get('uploadedAnswers')) {
      return true;
    } else {
      return false;
    }
  }.property('isUploadingAnswer', 'isCreatingWorkspace', 'savingAssignment', 'uploadedAnswers'),

  actions: {
    next() {
      this.get('onProceed')();
    },
    back() {
      this.get('onBack')(-1);
    }
  }
});