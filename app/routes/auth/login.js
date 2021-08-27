import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class LoginRoute extends Route {
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
