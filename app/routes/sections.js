import AuthenticatedRoute from './_authenticated_route';
import { hash } from 'rsvp';
import { service } from '@ember/service';

export default class SectionsRoute extends AuthenticatedRoute {
  @service currentUser;
  @service store;
  async model() {
    return hash(
      { 
        sections: this.store.findAll('section'), 
        isStudent: this.currentUser.isStudent,
        currentUser: this.currentUser.user // @TODO remove when section-list component upgraded
      });
  }
}
