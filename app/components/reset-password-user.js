// Used for when a logged in user is resetting either their own password or another user's password
Encompass.ResetPasswordUserComponent = Ember.Component.extend(
  Encompass.ErrorHandlingMixin, {
  ElementId: 'reset-password-user',
  alert: Ember.inject.service('sweet-alert'),
  displayResetForm: true,
  fieldType: 'password',
  postErrors: [],

  doPasswordsMatch: function() {
    return this.get('password') === this.get('confirmPassword');
  }.property('password', 'confirmPassword'),

  isShowingPassword: Ember.computed(function () {
    var showing = this.get('showingPassword');
    return showing;
  }),

  actions: {
    resetPassword: function() {
      const password = this.get('password');
      const confirmPassword = this.get('confirmPassword');

      if (!password || !confirmPassword) {
        this.set('missingRequiredFields', true);
      }

      if (!this.get('doPasswordsMatch')) {
        this.set('matchError', true);
        return;
      }

      const ssoId = this.get('user.ssoId');

      const resetPasswordData = {
        password,
        ssoId
       };
      const that = this;

      return Ember.$.post({
        url: `/auth/resetuser`,
        data: resetPasswordData
      })
        .then((res) => {
          if (res._id && res._id === ssoId) {
            that.get('handleResetSuccess')(res);
            this.get('alert').showToast('success', 'Password Reset', 'bottom-end', 3000, false, null);
          } else {
            let err;
            if (res.info) {
              err = res.info;
            } else {
              err = 'Could not complete reset. Please try again.';
            }
            that.set('resetError', err);
          }
        })
        .catch((err) => {
          that.handleErrors(err, 'postErrors');
        });
    },

    cancelReset: function() {
      this.cancelReset();
    },

    showPassword: function () {
      var isShowingPassword = this.get('showingPassword');
      if (isShowingPassword === false) {
        this.set('showingPassword', true);
        this.set('fieldType', 'text');
      } else {
        this.set('showingPassword', false);
        this.set('fieldType', 'password');
      }
    },

    resetErrors: function() {
      const errors = ['matchError', 'missingRequiredFields'];
      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    }
  }

});