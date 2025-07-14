import AuthenticatedRoute from './_authenticated_route';
import { hash } from 'rsvp';
import { service } from '@ember/service';

export default class SectionsRoute extends AuthenticatedRoute {
  @service store;
  @service currentUser;
  async model() {
    return hash({
      sections: this.store.findAll('section'),
      currentUser: this.currentUser.user,
    });
  }
}
