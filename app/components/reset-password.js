Encompass.ResetPasswordComponent = Ember.Component.extend({
  ElementId: 'reset-password',
  didReceiveAttrs: function() {
    const token = this.token;
    const that = this;
    if(token) {
      Ember.$.get({
        url: `/auth/reset/${token}`
      })
        .then((res) => {
          if (res.isValid) {
            that.set('isTokenValid', true);
          } else {
            console.log('invalid token');
            that.set('invalidTokenError', res.info);
            //that.sendAction('toForgot');
          }
        });
    }
    console.log('receiving attrs reset');

  },
  actions: {
    resetPassword: function() {
      const password = this.get('password');
      const confirmPassword = this.get('confirmPassword');

      const resetPasswordData = { password };
      const that = this;

      return Ember.$.post({
        url: `/auth/reset/${that.token}`,
        data: resetPasswordData
      })
        .then((res) => {
          console.log('resetPass response: ', res);
          that.sendAction('toHome');
        })
        .catch((err) => {
          this.set(('resetPasswordErr', err));
        });
    }
  }
});