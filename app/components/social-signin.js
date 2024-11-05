import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
export default class SocialSignInComponent extends Component {
  @service mtAuth;

  @tracked googleUrl = this.mtAuth.getSsoGoogleUrl();
}
