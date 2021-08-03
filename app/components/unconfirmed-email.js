import $ from 'jquery';
import Component from '@ember/component';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';






export default Component.extend(CurrentUserMixin, ErrorHandlingMixin, {
  elementId: ['unconfirmed-page'],
  emailErrors: [],

  actions: {
    sendEmail: function () {
      $.get('/auth/resend/confirm')
        .then((res) => {
          if (res.isSuccess) {
            this.set('emailSuccess', true);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'emailErrors');
        });
    }
  }
});