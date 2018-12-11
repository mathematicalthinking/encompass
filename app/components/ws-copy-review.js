Encompass.WsCopyReviewComponent = Ember.Component.extend({
  elementId: 'ws-copy-review',
  createDate: Date.now(),

  actions: {
    next() {
      this.get('onProceed')();
    },
    back() {
      this.get('onBack')(-1);
    }
  }

});