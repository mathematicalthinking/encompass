import Component from '@ember/component';
import { computed } from '@ember/object';
import $ from 'jquery';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  classNames: ['confirm-page'],
  confirmTokenErrors: [],
  isAlreadyConfirmed: false,
  invalidTokenError: null,
  isTokenValid: false,

  didReceiveAttrs: function () {
    const token = this.token;
    const that = this;
    if (token) {
      $.get({
        url: `/auth/confirm/${token}`,
      })
        .then((res) => {
          if (res.isValid) {
            that.set('isTokenValid', true);
          } else {
            let isAlreadyConfirmed =
              res.info === 'Email has already been confirmed';
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

  loginMessage: computed(
    'isAlreadyConfirmed',
    'invalidTokenError',
    function () {
      if (this.isAlreadyConfirmed) {
        return 'to get started using EnCoMPASS';
      }
      return 'and you will be redirected a page where you can request a new confirmation email to be sent to your email address on file.';
    }
  ),

  actions: {},
});
