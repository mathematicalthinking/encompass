import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ResetPasswordComponent extends Component {
  @service('sweet-alert') alert;
  @service errorHandling;
  @service navigation;

  @tracked isTokenValid = false;
  @tracked invalidTokenError = '';
  @tracked password = '';
  @tracked confirmPassword = '';
  @tracked matchError = false;
  @tracked missingRequiredFields = false;

  // expose service-backed arrays for template
  get getTokenErrors() {
    return this.errorHandling.getErrors('getTokenErrors') ?? [];
  }
  get resetPasswordErrors() {
    return this.errorHandling.getErrors('resetPasswordErrors') ?? [];
  }

  get doPasswordsMatch() {
    return this.password === this.confirmPassword;
  }

  // ---- lifecycle-ish (validate token once the element exists)
  @action
  async validateToken() {
    this.errorHandling.removeMessages('getTokenErrors');

    const token = this.args.token;
    if (!token) {
      this.isTokenValid = false;
      this.invalidTokenError = 'Missing reset token.';
      return;
    }

    try {
      const res = await fetch(`/auth/reset/${token}`, {
        method: 'GET',
        credentials: 'same-origin',
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.isValid) {
        this.isTokenValid = true;
        this.invalidTokenError = '';
      } else {
        this.isTokenValid = false;
        this.invalidTokenError = data?.info || 'Invalid or expired reset token.';
      }
    } catch (err) {
      this.isTokenValid = false;
      this.errorHandling.handleErrors(err, 'getTokenErrors');
    }
  }

  @action
  resetErrors() {
    this.matchError = false;
    this.missingRequiredFields = false;
    this.errorHandling.removeMessages('resetPasswordErrors');
  }

  @action
  onSubmit(e) {
    e.preventDefault();
    this.resetPassword();
  }

  @action
  async resetPassword() {
    this.resetErrors();

    if (!this.password || !this.confirmPassword) {
      this.missingRequiredFields = true;
      return;
    }
    if (!this.doPasswordsMatch) {
      this.matchError = true;
      return;
    }

    const token = this.args.token;
    const body = new URLSearchParams({ password: this.password });

    try {
      const res = await fetch(`/auth/reset/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        credentials: 'same-origin',
        body,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        this.errorHandling.handleErrors(
          data || { message: `Reset failed (${res.status})` },
          'resetPasswordErrors'
        );
        return;
      }

      this.alert.showToast('success', 'Password Reset', 'bottom-end', 3000, false, null);
      this.navigation.goHome({ replace: true });
    } catch (err) {
      this.errorHandling.handleErrors(err, 'resetPasswordErrors');
      this.errorHandling.displayErrorToast(err);
    } finally {
      this.password = '';
      this.confirmPassword = '';
    }
  }
}
