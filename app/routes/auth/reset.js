import LoggedOutRoute from './_logged_out_route';
import { action } from '@ember/object';

export default class ResetRoute extends LoggedOutRoute {
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
