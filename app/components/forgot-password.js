import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ForgotPasswordComponent extends Component {
  @service errorHandling;

  @tracked username = '';
  @tracked email = '';

  @tracked tooMuchData = false;
  @tracked missingRequiredFields = false;
  @tracked forgotPasswordErr = '';
  @tracked resetEmailSent = false;

  // central bucket for API errors
  get apiErrors() {
    return this.errorHandling.getErrors('forgotErrors') ?? [];
  }

  // --- validation helpers (kept close to your originals) ---
  validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  get isEmailValid() {
    if (!this.email) return true;       // don’t show error when blank
    return this.validateEmail(this.email);
  }

  get isEmailInvalid() {
    if (!this.email) return false;      // don’t show error when blank
    return !this.validateEmail(this.email);
  }

  clearFields() {
    this.email = '';
    this.username = '';
  }

  // --- UI events ---
  @action
  resetMessages() {
    this.forgotPasswordErr = '';
    this.missingRequiredFields = false;
    this.tooMuchData = false;
    this.resetEmailSent = false;
    this.errorHandling.removeMessages('forgotErrors');
  }

  @action
  onSubmit(e) {
    e.preventDefault();
    this.handleRequest();
  }

  @action
  async handleRequest() {
    this.resetMessages();

    const email = this.email?.trim();
    const username = this.username?.trim();

    if (!email && !username) {
      this.missingRequiredFields = true;
      return;
    }

    if (email && username) {
      this.tooMuchData = true;
      return;
    }

    if (email && !this.isEmailValid) {
      // show inline email error already; don’t call API
      return;
    }

    const body = new URLSearchParams();
    if (email) body.append('email', email);
    if (username) body.append('username', username);

    try {
      const res = await fetch('/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        credentials: 'same-origin',
        body
      });

      // parse json if advertised
      const ct = res.headers.get('content-type');
      let data = {};
      if (ct && ct.includes('application/json')) {
        try { data = await res.json(); } catch { /* ignore malformed */ }
      }

      if (!res.ok) {
        this.errorHandling.handleErrors(
          data || { message: `Request failed (${res.status})` },
          'forgotErrors'
        );
        return;
      }

      if (data?.isSuccess) {
        this.clearFields();
        this.resetEmailSent = true;
      } else {
        this.forgotPasswordErr = data?.info || 'Unable to send reset email. Please try again.';
      }
    } catch (err) {
      this.errorHandling.handleErrors(err, 'forgotErrors');
      this.errorHandling.displayErrorToast?.(err);
    }
  }
}
