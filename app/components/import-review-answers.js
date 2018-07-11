Encompass.ImportReviewAnswersComponent = Ember.Component.extend({
  actions: {
    formatAnswers: function() {
      this.get('uploadAnswers')();
    }
  }
});