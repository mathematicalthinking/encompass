import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SignupRoute extends Route {
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
