import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default class UsersUserRoute extends Route {
  @service store;
  async model(params) {
    const user = await this.store.findRecord('user', params.user_id);
    return hash({
      currentUser: this.modelFor('application'),
      user,
      userSections: this.store.query('section', {
        ids: user.sections.map((section) => section.sectionId),
      }),
      organizations: this.store.findAll('organization'),
    });
  }
}
