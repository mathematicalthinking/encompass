import { hash } from 'rsvp';
import AuthenticatedRoute from '../_authenticated_route';
import { service } from '@ember/service';

export default class SectionsNewRoute extends AuthenticatedRoute {
  @service store;
  @service router;
  beforeModel() {
    if (this.currentUser.isStudent) {
      this.router.transitionTo('sections');
    }
  }

  async model() {
    const organizations = this.store.findAll('organization');
    const sections = this.store.findAll('section');
    const addableTeachers = await this.store.query('user', {
      filterBy: { accountType: ['T', 'P', 'A'] },
    });
    return hash({
      addableTeachers,
      organizations,
      sections,
    });
  }
}
