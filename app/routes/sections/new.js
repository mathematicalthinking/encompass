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
    const users = await this.store.query('user', {});
    const addableTeachers = users.rejectBy('accountType', 'S');
    return hash({
      users,
      addableTeachers,
      organizations: this.store.findAll('organization'),
      user: this.currentUser.user,
      sections: this.store.findAll('section'),
    });
  }
}
