import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import $ from 'jquery';

export default class ConfirmEmailComponent extends ErrorHandlingComponent {
  @tracked confirmTokenErrors = [];
  @tracked isAlreadyConfirmed = false;
  @tracked invalidTokenError = null;
  @tracked isTokenValid = false;

  constructor() {
    super(...arguments);
    const token = this.args.token;
    if (token) {
      $.get({
        url: `/auth/confirm/${token}`,
      })
        .then((res) => {
          if (res.isValid) {
            this.isTokenValid = true;
          } else {
            let isAlreadyConfirmed =
              res.info === 'Email has already been confirmed';
            if (isAlreadyConfirmed) {
              this.isAlreadyConfirmed = true;
              return;
            }
            this.invalidTokenError = res.info;
          }
        })
        .catch((err) => {
          this[err] = 'confirmTokenErrors';
        });
    }
  }

  get loginMessage() {
    if (this.isAlreadyConfirmed) {
      return 'to get started using EnCoMPASS';
    }
    return 'and you will be redirected a page where you can request a new confirmation email to be sent to your email address on file.';
  }
}
