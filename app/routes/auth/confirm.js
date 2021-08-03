import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class ConfirmRoute extends Route {
  model(params) {
    return params.token;
  }
  renderTemplate() {
    this.render('auth/confirm');
  }

  @action toHome() {
    window.location.href = '/';
  }
}
