import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import $ from 'jquery';

export default class LogInComponent extends ErrorHandlingComponent {
  @tracked incorrectPassword = false;
  @tracked incorrectUsername = false;
  @tracked missingCredentials = false;
  @tracked username = '';
  @tracked password = '';
  @tracked postErrors = [];
  @tracked oauthError = '';

  get oauthErrorMsg() {
    if (this.oauthError === 'emailUnavailable') {
      return 'The provided email address is already associated with an existing account';
    }
    return '';
  }

  @action
  resetErrors() {
    const errors = [
      'incorrectUsername',
      'incorrectPassword',
      'missingCredentials',
    ];

    for (let error of errors) {
      if (this[error]) {
        this[error] = false;
      }
    }
  }

  @action
  async login() {
    if (!this.username.trim() || !this.password) {
      this.missingCredentials = true;
      return;
    }
    const createUserData = {
      username: this.username.trim(),
      password: this.password,
    };
    $.post({
      url: '/auth/login',
      data: createUserData,
    })
      .then((res) => {
        console.log(res);
        if (res.message === 'Incorrect password') {
          this.incorrectPassword = true;
        } else if (res.message === 'Incorrect username') {
          this.incorrectUsername = true;
        } else {
          window.location.href = '/';
        }
      })
      .catch((err) => {
        this.handleErrors(err, 'postErrors');
      });
  }
}
