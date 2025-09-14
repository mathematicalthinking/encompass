import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SignupRoute extends Route {
  @service store;

  async model() {
    // DS.ManyArray (or array-like) of organizations
    return this.store.query('organization', { sortBy: 'members' });
  }
}
