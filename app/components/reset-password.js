Encompass.ResetPasswordComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  classNames: ['reset-page'],
  getTokenErrors: [],
  resetPasswordErrors: [],
  alert: Ember.inject.service('sweet-alert'),

  didReceiveAttrs: function() {
    const token = this.token;
    const that = this;
    if (token) {
      Ember.$.get({
        url: `/auth/reset/${token}`
      })
        .then((res) => {
          if (res.isValid) {
            that.set('isTokenValid', true);
          } else {
            that.set('invalidTokenError', res.info);
          }

        })
        .catch((err) => {
          that.handleErrors(err, 'getTokenErrors');
        });
    }
  },

  doPasswordsMatch: function() {
    return this.get('password') === this.get('confirmPassword');
  }.property('password', 'confirmPassword'),

  actions: {
    resetPassword: function() {
      const password = this.get('password');
      const confirmPassword = this.get('confirmPassword');

      if (!password || !confirmPassword) {
        this.set('missingRequiredFields', true);
        return;
      }
      if (!this.get('doPasswordsMatch')) {
        this.set('matchError', true);
        return;
      }

      const resetPasswordData = { password };
      const that = this;

      return Ember.$.post({
        url: `/auth/reset/${that.token}`,
        data: resetPasswordData
      })
        .then((res) => {
          this.get('alert').showToast('success', 'Password Reset', 'bottom-end', 3000, false, null);
          that.sendAction('toHome');
        })
        .catch((err) => {
          this.handleErrors(err, 'resetPasswordErrors');
        });
    },
    resetErrors: function(e) {
      console.log('event', e);
      const errors = ['matchError', 'missingCredentials'];
      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    }
  }
});