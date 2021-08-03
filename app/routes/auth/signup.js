import LoggedOutRoute from './_logged_out_route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SignupRoute extends LoggedOutRoute {
  @service store;
  model() {
    return this.store
      .query('organization', {
        sortBy: 'members',
      })
      .then((orgs) => {
        return orgs;
      });
  }

  @action toHome() {
    window.location.href = '/';
  }
}
