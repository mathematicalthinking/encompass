Encompass.SubmissionViewerListComponent = Ember.Component.extend({
  elementId: 'submission-viewer-list',
  scrollBottom: true,

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
    superScroll: function () {
      //should only show scroll option after the user scrolls a little
      if (!this.get('scrollBottom')) {
        $("html, body").animate({
          scrollTop: 0
        });
      } else {
        $("html, body").animate({
          scrollTop: $(document).height() - $(window).height()
        });
      }
      this.set('scrollBottom', !this.get('scrollBottom'));
    },
  }
});