Encompass.UserNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-new',

  actions: {
    toUserInfo: function(user) {
      this.sendAction('toUserInfo', user);
    },
    toUserHome: function () {
      this.sendAction('toUserHome');
    }
  },
});

