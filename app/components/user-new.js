import Component from '@ember/component';






export default Component.extend({
  elementId: 'user-new',

  actions: {
    toUserInfo: function (user) {
      this.sendAction('toUserInfo', user);
    },
    toUserHome: function () {
      this.sendAction('toUserHome');
    }
  },
});

