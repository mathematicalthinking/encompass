import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  classNames: ['forgot-page'],
  postErrors: [],

  validateEmail: function () {
    var email = this.email;
    if (!email) {
      return false;
    }
    var emailPattern = new RegExp(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    );
    var emailTest = emailPattern.test(email);

    if (emailTest === false) {
      return false;
    }

    if (emailTest === true) {
      return true;
    }
  },
  isEmailValid: computed('email', function () {
    if (!this.isEmailDirty && !isEmpty(this.email)) {
      this.set('isEmailDirty', true);
    }
    return this.validateEmail();
  }),

  // We don't want error being displayed when form loads initially
  isEmailInvalid: computed('isEmailValid', 'isEmailDirty', function () {
    return this.isEmailDirty && !this.isEmailValid && !isEmpty(this.email);
  }),

  clearFields: function () {
    const fields = ['email', 'username'];
    for (let field of fields) {
      this.set(field, null);
    }
  },

  actions: {
    handleRequest: function () {
      const email = this.email;
      const username = this.username;

      if (!email && !username) {
        this.set('missingRequiredFields', true);
        return;
      }

      if (email && username) {
        this.set('tooMuchData', true);
        return;
      }

      const that = this;
      const forgotPasswordData = {
        email,
        username,
      };

      return $.post({
        url: '/auth/forgot',
        data: forgotPasswordData,
      })
        .then((res) => {
          if (res.isSuccess) {
            that.clearFields();
            that.set('resetEmailSent', true);
          } else {
            that.set('forgotPasswordErr', res.info);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'postErrors');
        });
    },
    resetMessages: function () {
      const messages = [
        'forgotPasswordErr',
        'missingRequiredFields',
        'tooMuchData',
        'resetEmailSent',
      ];

      for (let message of messages) {
        if (this.get(message)) {
          this.set(message, false);
        }
      }
    },
  },
});
