import $ from 'jquery';
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
  sendEmail() {
    $.get('/auth/resend/confirm')
      .then((res) => {
        if (res.isSuccess) {
          this.emailSuccess = true;
          this.errorHandling.removeMessages('emailErrors');
        }
      })
      .catch((err) => {
        this.errorHandling.handleErrors(err, 'emailErrors');
      });
  }
}
