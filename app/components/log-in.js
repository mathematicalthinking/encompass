import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class LogInComponent extends ErrorHandlingComponent {
  @service navigation;

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
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        body: new URLSearchParams(createUserData),
      });
      if (!response.ok) {
        throw new Error(`Login failed (${response.status})`);
      }
      const res = await response.json();
      if (res.message === 'Incorrect password') {
        this.incorrectPassword = true;
      } else if (res.message === 'Incorrect username') {
        this.incorrectUsername = true;
      } else {
        this.navigation.toHome({ fullReload: true });
      }
    } catch (err) {
      this.handleErrors(err, 'postErrors');
    }
  }
}
