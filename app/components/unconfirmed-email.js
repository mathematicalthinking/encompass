import $ from 'jquery';
import Component from '@ember/component';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  elementId: ['unconfirmed-page'],
  emailErrors: [],
  errorHandling: service('error-handling'),
  actions: {
    sendEmail: function () {
      $.get('/auth/resend/confirm')
        .then((res) => {
          if (res.isSuccess) {
            this.set('emailSuccess', true);
          }
        })
        .catch((err) => {
          this.errorHandling.handleErrors(err, 'emailErrors');
        });
    },
  },
});
