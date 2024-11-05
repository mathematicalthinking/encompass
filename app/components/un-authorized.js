import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
export default class UnAuthorizedComponent extends Component {
  @service mtAuth;
  @service currentUser;

  get needAdditionalInfo() {
    return this.currentUser.user.needAdditionalInfo;
  }

  get googleId() {
    return this.currentUser.user.googleId;
  }

  get contactEmail() {
    return this.mtAuth.getContactEmail();
  }
}
