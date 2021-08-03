import Component from '@ember/component';






export default Component.extend({
  elementId: 'ws-copy-review',
  createDate: Date.now(),

  actions: {
    next() {
      this.onProceed();
    },
    back() {
      this.onBack(-1);
    }
  }

});