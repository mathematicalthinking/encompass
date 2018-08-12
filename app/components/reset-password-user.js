// Used for when a logged in user is resetting either their own password or another user's password
Encompass.ResetPasswordUserComponent = Ember.Component.extend({
  ElementId: 'reset-password-user',

  doPasswordsMatch: function() {
    return this.get('password') === this.get('confirmPassword');
  }.property('password', 'confirmPassword'),

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

      const id = this.user.id;

      const resetPasswordData = {
        password,
        id
       };
      const that = this;

      return Ember.$.post({
        url: `/auth/resetuser`,
        data: resetPasswordData
      })
        .then((res) => {
          console.log('resetPass response: ', res);
          if (res._id && res._id === id) {
            that.get('handleResetSuccess')(res);
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
          console.log('err', err);
          that.set(('resetError', err));
        });
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