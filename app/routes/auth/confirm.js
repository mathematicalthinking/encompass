import Route from '@ember/routing/route';

export default class ConfirmRoute extends Route {
  model(params) {
    return params.token;
  }
}
