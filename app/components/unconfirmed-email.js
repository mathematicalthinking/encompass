import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class UnconfirmedEmailComponent extends Component {
  @service errorHandling;
  @service currentUser;
  @tracked emailSuccess = false;

  get emailErrors() {
    return this.errorHandling.getErrors('emailErrors') || [];
  }

  get displayName() {
    return this.currentUser.user.displayName;
  }

  get email() {
    return this.currentUser.user.email;
  }

  @action
  async sendEmail() {
    try {
      const response = await fetch('/auth/resend/confirm');
      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }
      const res = await response.json();
      if (res.isSuccess) {
        this.emailSuccess = true;
        this.errorHandling.removeMessages('emailErrors');
      }
    } catch (err) {
      this.errorHandling.handleErrors(err, 'emailErrors');
    }
  }
}
