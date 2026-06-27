import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ResetPasswordComponent extends Component {
  @service('sweet-alert') alert;
  @service errorHandling;
  @service navigation;

  @tracked isTokenValid = false;
  @tracked invalidTokenError = null;
  @tracked password = null;
  @tracked confirmPassword = null;
  @tracked matchError = false;
  @tracked missingRequiredFields = false;
  @tracked getTokenErrors = [];
  @tracked resetPasswordErrors = [];

  get doPasswordsMatch() {
    return this.password === this.confirmPassword;
  }

  parseErrorMessage(status, body) {
    if (!body) {
      return `Request failed with status ${status}`;
    }
    try {
      let parsed = JSON.parse(body);
      return parsed?.errors?.[0]?.detail || parsed?.message || body;
    } catch (_err) {
      return body;
    }
  }

  @action
  async validateToken() {
    let token = this.args.token;
    if (!token) {
      return;
    }
    try {
      let response = await fetch(`/auth/reset/${token}`);
      if (!response.ok) {
        let body = await response.text();
        throw new Error(this.parseErrorMessage(response.status, body));
      }
      let res = await response.json();
      if (res.isValid) {
        this.isTokenValid = true;
      } else {
        this.invalidTokenError = res.info;
      }
    } catch (err) {
      this.getTokenErrors = [err?.message || 'Unable to verify reset link'];
      this.errorHandling.handleErrors(err, 'getTokenErrors');
    }
  }

  @action
  async resetPassword() {
    let { password, confirmPassword } = this;

    if (!password || !confirmPassword) {
      this.missingRequiredFields = true;
      return;
    }
    if (!this.doPasswordsMatch) {
      this.matchError = true;
      return;
    }

    try {
      let response = await fetch(`/auth/reset/${this.args.token}`, {
        method: 'POST',
        body: new URLSearchParams({ password }),
      });
      if (!response.ok) {
        let body = await response.text();
        throw new Error(this.parseErrorMessage(response.status, body));
      }
      this.alert.showToast(
        'success',
        'Password Reset',
        'bottom-end',
        3000,
        false,
        null
      );
      // Was `sendAction('toHome')`, which is dead under Ember 4.x — navigate via
      // the navigation service (fullReload mirrors the old hard redirect to '/').
      this.navigation.toHome({ fullReload: true });
    } catch (err) {
      this.resetPasswordErrors = [err?.message || 'Password reset failed'];
      this.errorHandling.handleErrors(err, 'resetPasswordErrors');
    }
  }

  @action
  resetErrors() {
    if (this.matchError) {
      this.matchError = false;
    }
    if (this.missingRequiredFields) {
      this.missingRequiredFields = false;
    }
  }
}
