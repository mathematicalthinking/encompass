import Route from '@ember/routing/route';

export default class ResetRoute extends Route {
  model(params) {
    return params.token;
  }
  renderTemplate() {
    this.render('auth/reset');
  }
}
