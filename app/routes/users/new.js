import AuthenticatedRoute from '../_authenticated_route';
import { hash } from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class UsersNewRoute extends AuthenticatedRoute {
  @service store;
  async model() {
    const currentUser = this.modelFor('application');
    return hash({
      currentUser,
      organizations: await this.store.findAll('organization'),
    });
  }
}
