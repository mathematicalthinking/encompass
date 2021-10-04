import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import $ from 'jquery';

export default class ForgotPasswordComponent extends ErrorHandlingComponent {
  @tracked postErrors = [];
  @tracked username = '';
  @tracked email = '';
  @tracked tooMuchData = false;
  @tracked missingRequiredFields = false;
  @tracked forgotPasswordErr = false;
  @tracked resetEmailSent = false;

  validateEmail(email) {
    const emailPattern = new RegExp(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    );
    return emailPattern.test(email);
  }
  get isEmailValid() {
    if (!this.email) {
      return true;
    }
    return this.validateEmail(this.email);
  }

  // We don't want error being displayed when form loads initially
  get isEmailInvalid() {
    if (!this.email) {
      return false;
    }
    return !this.validateEmail(this.email);
  }

  clearFields() {
    const fields = ['email', 'username'];
    for (let field of fields) {
      this[field] = '';
    }
  }

  @action handleRequest() {
    const email = this.email;
    const username = this.username;

    if (!email && !username) {
      this.missingRequiredFields = true;
      return;
    }

    if (email && username) {
      this.tooMuchData = true;
      return;
    }
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
          this.clearFields();
          this.resetEmailSent = true;
        } else {
          this.forgotPasswordErr = res.info;
        }
      })
      .catch((err) => {
        this.handleErrors(err, 'postErrors');
      });
  }
  @action resetMessages() {
    const messages = [
      'forgotPasswordErr',
      'missingRequiredFields',
      'tooMuchData',
      'resetEmailSent',
    ];

    for (let message of messages) {
      if (this[message]) {
        this[message] = false;
      }
    }
  }
}
