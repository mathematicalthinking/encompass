Encompass.AuthHomeComponent = Ember.Component.extend({
  test: null,
  test2: null,

  init() {
    this.set('login', true);
  },

  actions: {
    changeComponent: function () {
      // if (login) {
      //   return !login;
      // } else if (this.changeComponent = 'signup') {
      //   return this.currentComponent = 'login';
      // }
    },

    // selectChange: function () {
    //   var changeAction = this.get('action');
    //   var selectedEl = this.$('select')[0];
    //   var selectedIndex = selectedEl.selectedIndex;
    //   var content = this.get('content');
    //   var selectedValue = content[selectedIndex];

    //   this.set('selectedValue', selectedValue);
    //   changeAction(selectedValue);
    // }
  }
});

