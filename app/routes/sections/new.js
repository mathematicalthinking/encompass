import { hash } from 'rsvp';
import AuthenticatedRoute from '../_authenticated_route';
import { service } from '@ember/service';

export default class SectionsNewRoute extends AuthenticatedRoute {
  @service store;
  @service router;
  @service currentUser;
  beforeModel() {
    if (this.currentUser.isStudent) {
      this.router.transitionTo('sections');
    }
  }

  async model() {
    const organizations = this.store.findAll('organization');
    const sections = this.store.findAll('section');
    const users = await this.store.query('user', {});
    const addableTeachers = users.rejectBy('accountType', 'S');
    return hash({
      // @TODO: pass along organization of current user bc used in component
      users,
      addableTeachers,
      organizations,
      user: this.currentUser.user, // @TODO: remove this and use service in component
      sections,
    });
  }
}
