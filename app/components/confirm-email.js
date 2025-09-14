import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ConfirmEmailComponent extends Component {
  @service errorHandling;

  @tracked isTokenValid = false;
  @tracked isAlreadyConfirmed = false;
  @tracked invalidTokenError = null;

  get confirmTokenErrors() {
    return this.errorHandling.getErrors('confirmTokenErrors') ?? [];
  }

  get loginMessage() {
    return this.isAlreadyConfirmed
      ? 'to get started using EnCoMPASS'
      : 'and you will be redirected a page where you can request a new confirmation email to be sent to your email address on file.';
  }

  @action
  async validateToken() {
    this.errorHandling.removeMessages('confirmTokenErrors');
    this.isTokenValid = false;
    this.isAlreadyConfirmed = false;
    this.invalidTokenError = null;

    const token = this.args.token;
    if (!token) {
      this.invalidTokenError = 'Missing confirmation token.';
      return;
    }

    try {
      const res = await fetch(`/auth/confirm/${token}`, {
        method: 'GET',
        credentials: 'same-origin',
      });

      const contentType = res.headers.get('content-type');
      const data = (contentType && contentType.includes('application/json'))
         ? await res.json() 
         : {}
  
      // Happy path
      if (res.ok && data?.isValid) {
        this.isTokenValid = true;
        return;
      }

      // Not valid — distinguish “already confirmed” vs other errors
      const info = data?.info || 'Invalid or expired confirmation link.';
      if (info === 'Email has already been confirmed') {
        this.isAlreadyConfirmed = true;
        return;
      }

      this.invalidTokenError = info;
    } catch (err) {
      // Route all unexpected errors through the service
      this.errorHandling.handleErrors(err, 'confirmTokenErrors');
    }
  }
}
