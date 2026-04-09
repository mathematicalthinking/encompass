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
    const addableTeachers = users.filter((user) => user.accountType !== 'S');
    const organization = await this.currentUser.user.organization;
    return hash({
      organization,
      users,
      addableTeachers,
    });
  }
}
