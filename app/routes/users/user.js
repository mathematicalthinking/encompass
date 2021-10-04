import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class UsersUserRoute extends Route {
  @service store;
  async model(params) {
    const user = await this.store.findRecord('user', params.user_id);
    const userSections = await this.store.query('section', {
      ids: user.sections.map((section) => section.sectionId),
    });
    let currentUser = this.modelFor('application');
    return hash({
      currentUser,
      user,
      userSections,
      organizations: await this.store.findAll('organization'),
    });
  }
  @action refresh() {
    this.refresh();
  }
}
