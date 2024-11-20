import $ from 'jquery';
import Component from '@ember/glimmer';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class UnconfirmedEmailComponent extends Component {
  @service errorHandling;
  @service currentUser;
  @tracked emailErrors = [];
  @tracked emailSuccess = false;

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
        }
      })
      .catch((err) => {
        this.errorHandling.handleErrors(err, 'emailErrors');
      });
  }
}
