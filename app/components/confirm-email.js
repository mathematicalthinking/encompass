Encompass.ConfirmEmailComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  classNames: ['confirm-page'],
  confirmTokenErrors: [],
  isAlreadyConfirmed: false,
  invalidTokenError: null,
  isTokenValid: false,

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
            let isAlreadyConfirmed = res.info === 'Email has already been confirmed';
            if (isAlreadyConfirmed) {
              that.set('isAlreadyConfirmed', true);
              return;
            }
            that.set('invalidTokenError', res.info);
          }

        })
        .catch((err) => {
          that.set(err, 'confirmTokenErrors');
        });
    }
  },

  loginMessage: function() {
    if (this.get('isAlreadyConfirmed')) {
      return 'to get started using EnCoMPASS';
    }
    return 'and you will be redirected a page where you can request a new confirmation email to be sent to your email address on file.';
  }.property('isAlreadyConfirmed', 'invalidTokenError'),


  actions: {

  }
});