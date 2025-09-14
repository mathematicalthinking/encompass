import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class UnconfirmedEmailComponent extends Component {
  @service errorHandling;
  @service currentUser;

  @tracked emailSuccess = false;

  get emailErrors() {
    return this.errorHandling.getErrors('emailErrors') ?? [];
  }

  get displayName() {
    return this.currentUser.user?.displayName ?? '';
  }

  get email() {
    return this.currentUser.user?.email ?? '';
  }

  @action
  async sendEmail() {
    this.emailSuccess = false;
    this.errorHandling.removeMessages('emailErrors');

    try {
      const res = await fetch('/auth/resend/confirm', {
        method: 'GET',
        credentials: 'same-origin',
      });

      // Safely parse JSON only when appropriate
      const contentType = res.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = {};
        }
      }

      if (!res.ok) {
        this.errorHandling.handleErrors(
          data || { message: `Resend failed (${res.status})` },
          'emailErrors'
        );
        return;
      }

      // Treat either HTTP 200 or payload flag as success
      if (data?.isSuccess !== false) {
        this.emailSuccess = true;
        this.errorHandling.removeMessages('emailErrors');
      }
    } catch (err) {
      this.errorHandling.handleErrors(err, 'emailErrors');
    }
  }
}
