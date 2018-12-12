/*global _:false */
Encompass.SubmissionViewerListComponent = Ember.Component.extend({
  elementId: 'submission-viewer-list',

  didReceiveAttrs() {
    this._super(...arguments);
  },

  answersSelectedHash: function() {
    let hash = {};

    this.get('answers').forEach((answer) => {
      let isSelected = this.get('selectedAnswers').includes(answer);
      hash[answer.get('id')] = isSelected;
    });
    return hash;
  }.property('answers.[]', 'selectedAnswers.[]'),


  actions: {
    onSelect: function(answer, isChecked) {
      this.get('onSelect')(answer, isChecked);
    },
  }
});