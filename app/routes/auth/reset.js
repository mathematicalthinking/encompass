import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class ResetRoute extends Route {
  model(params) {
    return params.token;
  }
  renderTemplate() {
    this.render('auth/reset');
  }

  @action toHome() {
    window.location.href = '/';
  }
}
