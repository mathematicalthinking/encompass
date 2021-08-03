import LoggedOutRoute from './_logged_out_route';
import { action } from '@ember/object';

export default class LoginRoute extends LoggedOutRoute {
  beforeModel(transition) {
    if (transition.intent.queryParams) {
      this.oauthError = transition.intent.queryParams.oauthError;
    }
  }

  model() {
    return {
      oauthError: this.oauthError,
    };
  }

  @action toHome() {
    window.location.href = '/';
  }
}
