import Component from '@ember/component';






export default Component.extend({
  actions: {
    formatAnswers: function () {
      this.uploadAnswers();
    },

    radioSelect: function (value) {
      this.set('mode', value);
    },
  }
});