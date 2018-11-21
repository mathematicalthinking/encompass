Encompass.WsCopyReviewComponent = Ember.Component.extend({
  elementId: 'ws-copy-review',

  actions: {
    next() {
      this.get('onProceed')();
    }
  }

});