import AuthenticatedRoute from '../_authenticated_route';
import { hash } from 'rsvp';
import { service } from '@ember/service';

export default class UsersNewRoute extends AuthenticatedRoute {
  @service store;
  async model() {
    return hash({
      organizations: this.store.findAll('organization'),
    });
  }
}
