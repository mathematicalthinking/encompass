import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';

export default class ConfirmEmailComponent extends ErrorHandlingComponent {
  @tracked confirmTokenErrors = [];
  @tracked isAlreadyConfirmed = false;
  @tracked invalidTokenError = null;
  @tracked isTokenValid = false;

  constructor() {
    super(...arguments);
    if (this.args.token) {
      this.verifyToken(this.args.token);
    }
  }

  async verifyToken(token) {
    try {
      const response = await fetch(`/auth/confirm/${token}`);
      if (!response.ok) {
        throw new Error(`Confirmation failed (${response.status})`);
      }
      const res = await response.json();
      if (res.isValid) {
        this.isTokenValid = true;
      } else if (res.info === 'Email has already been confirmed') {
        this.isAlreadyConfirmed = true;
      } else {
        this.invalidTokenError = res.info;
      }
    } catch (err) {
      this.confirmTokenErrors = [err?.message || 'Unable to confirm email'];
    }
  }

  get loginMessage() {
    if (this.isAlreadyConfirmed) {
      return 'to get started using EnCoMPASS';
    }
    return 'and you will be redirected a page where you can request a new confirmation email to be sent to your email address on file.';
  }
}
