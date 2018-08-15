Encompass.ConfirmEmailComponent = Ember.Component.extend({
  classNames: ['confirm-page'],
  didReceiveAttrs: function() {
    const token = this.token;
    const that = this;
    if (token) {
      Ember.$.get({
        url: `/auth/confirm/${token}`
      })
        .then((res) => {
          if (res.isValid) {
            that.set('isTokenValid', true);
          } else {
            that.set('invalidTokenError', res.info);
          }

        })
        .catch((err) => {
          that.set('invalidTokenError', err);
        });
    }
  },


  actions: {

  }
});