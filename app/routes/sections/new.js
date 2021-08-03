import { hash } from 'rsvp';
import AuthenticatedRoute from '../_authenticated_route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

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
    return hash({
      users: await this.store.findAll('user'),
      organizations: await this.store.findAll('organization'),
      user: await this.modelFor('application'),
      sections: await this.store.findAll('section'),
    });
  }

  @action toSectionInfo(section) {
    this.transitionTo('sections.section', section.id);
  }
  @action toSectionsHome() {
    this.transitionTo('sections');
  }
}
