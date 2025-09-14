import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ResetPasswordUserComponent extends Component {
  @service errorHandling;
  @service('sweet-alert') alert;

  @tracked password = '';
  @tracked confirmPassword = '';
  @tracked showingPassword = false;

  @tracked missingRequiredFields = false;
  @tracked matchError = false;
  @tracked resetError = '';

  get doPasswordsMatch() {
    return this.password === this.confirmPassword;
  }

  get fieldType() {
    return this.showingPassword ? 'text' : 'password';
  }

  get apiErrors() {
    // centralizes all non-field errors under one key
    return this.errorHandling.getErrors('resetUserErrors') ?? [];
  }

  @action
  resetErrors() {
    this.missingRequiredFields = false;
    this.matchError = false;
    this.resetError = '';
    this.errorHandling.removeMessages('resetUserErrors');
  }

  @action
  toggleShowingPassword() {
    this.showingPassword = !this.showingPassword;
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

    const ssoId = this.args.user?.ssoId;
    if (!ssoId) {
      this.resetError = 'Missing user identifier.';
      return;
    }

    const body = new URLSearchParams({ password: this.password, ssoId });

    try {
      const res = await fetch('/auth/resetuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        credentials: 'same-origin',
        body
      });

      // parse JSON only when advertised
      const ct = res.headers.get('content-type');
      let data = {};
      if (ct && ct.includes('application/json')) {
        try { data = await res.json(); } catch { /* fall through with {} */ }
      }

      if (!res.ok) {
        this.errorHandling.handleErrors(
          data || { message: `Reset failed (${res.status})` },
          'resetUserErrors'
        );
        return;
      }

      // legacy success check
      if (data?._id && data._id === ssoId) {
        this.alert.showToast('success', 'Password Reset', 'bottom-end', 3000, false, null);
        this.args.handleResetSuccess?.(data);
        this.password = '';
        this.confirmPassword = '';
        return;
      }

      // server responded 200 but not the expected shape
      this.resetError = data?.info || 'Could not complete reset. Please try again.';
    } catch (err) {
      this.errorHandling.handleErrors(err, 'resetUserErrors');
      this.errorHandling.displayErrorToast?.(err);
    }
  }

  @action
  cancelReset() {
    this.args.cancelReset?.();
  }
}
