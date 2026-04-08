import AuthenticatedRoute from './_authenticated_route';
import { hash } from 'rsvp';
import { service } from '@ember/service';

export default class SectionsRoute extends AuthenticatedRoute {
  @service store;
  @service currentUser;
  async model() {
    return hash({
      isStudent: this.currentUser.isStudent, // used by template to conditionally show "Create New Class" button
      sections: this.store.findAll('section'),
    });
  }
}
