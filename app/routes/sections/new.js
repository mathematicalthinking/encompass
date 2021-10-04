import { hash } from 'rsvp';
import AuthenticatedRoute from '../_authenticated_route';
import { inject as service } from '@ember/service';

export default class SectionsNewRoute extends AuthenticatedRoute {
  @service store;
  beforeModel() {
    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.transitionTo('sections');
    }
  }

  async model() {
    const users = await this.store.query('user', {});
    const addableTeachers = users.rejectBy('accountType', 'S');
    return hash({
      users,
      addableTeachers,
      organizations: await this.store.findAll('organization'),
      user: await this.modelFor('application'),
      sections: await this.store.findAll('section'),
    });
  }
}
