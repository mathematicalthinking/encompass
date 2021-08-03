import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
// Used for when a logged in user is resetting either their own password or another user's password
import $ from 'jquery';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  ElementId: 'reset-password-user',
  alert: service('sweet-alert'),
  displayResetForm: true,
  fieldType: 'password',
  postErrors: [],

  doPasswordsMatch: computed('password', 'confirmPassword', function () {
    return this.password === this.confirmPassword;
  }),

  isShowingPassword: computed('showingPassword', function () {
    var showing = this.showingPassword;
    return showing;
  }),

  actions: {
    resetPassword: function () {
      const password = this.password;
      const confirmPassword = this.confirmPassword;

      if (!password || !confirmPassword) {
        this.set('missingRequiredFields', true);
      }

      if (!this.doPasswordsMatch) {
        this.set('matchError', true);
        return;
      }

      const ssoId = this.user.ssoId;

      const resetPasswordData = {
        password,
        ssoId,
      };
      const that = this;

      return $.post({
        url: `/auth/resetuser`,
        data: resetPasswordData,
      })
        .then((res) => {
          if (res._id && res._id === ssoId) {
            that.get('handleResetSuccess')(res);
            this.alert.showToast(
              'success',
              'Password Reset',
              'bottom-end',
              3000,
              false,
              null
            );
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

    cancelReset: function () {
      this.cancelReset();
    },

    showPassword: function () {
      var isShowingPassword = this.showingPassword;
      if (isShowingPassword === false) {
        this.set('showingPassword', true);
        this.set('fieldType', 'text');
      } else {
        this.set('showingPassword', false);
        this.set('fieldType', 'password');
      }
    },

    resetErrors: function () {
      const errors = ['matchError', 'missingRequiredFields'];
      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    },
  },
});
