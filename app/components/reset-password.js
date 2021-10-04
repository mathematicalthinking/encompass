import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  classNames: ['reset-page'],
  getTokenErrors: [],
  resetPasswordErrors: [],
  alert: service('sweet-alert'),

  didReceiveAttrs: function () {
    const token = this.token;
    const that = this;
    if (token) {
      $.get({
        url: `/auth/reset/${token}`,
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

  doPasswordsMatch: computed('password', 'confirmPassword', function () {
    return this.password === this.confirmPassword;
  }),

  actions: {
    resetPassword: function () {
      const password = this.password;
      const confirmPassword = this.confirmPassword;

      if (!password || !confirmPassword) {
        this.set('missingRequiredFields', true);
        return;
      }
      if (!this.doPasswordsMatch) {
        this.set('matchError', true);
        return;
      }

      const resetPasswordData = { password };
      const that = this;

      return $.post({
        url: `/auth/reset/${that.token}`,
        data: resetPasswordData,
      })
        .then((res) => {
          this.alert.showToast(
            'success',
            'Password Reset',
            'bottom-end',
            3000,
            false,
            null
          );
          that.sendAction('toHome');
        })
        .catch((err) => {
          this.handleErrors(err, 'resetPasswordErrors');
        });
    },
    resetErrors: function (e) {
      const errors = ['matchError', 'missingCredentials'];
      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    },
  },
});
