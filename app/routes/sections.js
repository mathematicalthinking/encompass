import AuthenticatedRoute from './_authenticated_route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default class SectionsRoute extends AuthenticatedRoute {
  @service store;
  async model() {
    let sections = await this.store.findAll('section');
    let currentUser = this.modelFor('application');
    return hash({ sections, currentUser });
  }
}
