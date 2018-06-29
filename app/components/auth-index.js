Encompass.AuthIndexComponent = Ember.Component.extend({
  shouldShowLogin: null,


  init: function () {
    this._super(...arguments);
    this.set('shouldShowLogin', true);
  },

  actions: {
    changeComponent: function () {
      console.log('shouldShowLogin:', this.shouldShowLogin);
      if (this.shouldShowLogin) {
        this.set('shouldShowLogin', false);
      } else {
        this.set('shouldShowLogin', true);
      }
    }
  }
});

