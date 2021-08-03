import Component from '@ember/component';






export default Component.extend({
  shouldShowLogin: null,


  init: function () {
    this._super(...arguments);
    this.set('shouldShowLogin', true);
  },

  actions: {
    changeComponent: function () {
      if (this.shouldShowLogin) {
        this.set('shouldShowLogin', false);
      } else {
        this.set('shouldShowLogin', true);
      }
    }
  }
});

