import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LogInComponent extends Component {
  @service errorHandling;
  @service navigation;

  @tracked username = '';
  @tracked password = '';
  @tracked incorrectPassword = false;
  @tracked incorrectUsername = false;
  @tracked missingCredentials = false;

  get oauthErrorMsg() {
    return this.args.oauthError === 'emailUnavailable'
      ? 'The provided email address is already associated with an existing account'
      : '';
  }

  get loginErrors() {
    return this.errorHandling.getErrors('loginErrors') ?? [];
  }

  @action
  resetErrors() {
    this.incorrectPassword = false;
    this.incorrectUsername = false;
    this.missingCredentials = false;
    this.errorHandling.removeMessages('loginErrors');
  }

  @action
  onSubmit(e) {
    e.preventDefault();
    this.login();
  }

  @action
  async login() {
    this.resetErrors();

    const username = this.username.trim();
    if (!username || !this.password) {
      this.missingCredentials = true;
      return;
    }

    const body = new URLSearchParams({ username, password: this.password });

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (data?.message === 'Incorrect password') {
        this.incorrectPassword = true;
        return;
      }
      if (data?.message === 'Incorrect username') {
        this.incorrectUsername = true;
        return;
      }
      if (!res.ok) {
        this.errorHandling.handleErrors(
          data || { message: `Login failed (${res.status})` },
          'loginErrors'
        );
        return;
      }

      this.navigation.goHome();
    } catch (err) {
      this.errorHandling.handleErrors(err, 'loginErrors');
      this.errorHandling.displayErrorToast(err);
    }
  }
}
