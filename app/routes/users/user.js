import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { service } from '@ember/service';

export default class UsersUserRoute extends Route {
  @service store;
  @service currentUser;
  async model(params) {
    const user = await this.store.findRecord('user', params.user_id);
    return hash({
      currentUser: this.currentUser.user,
      user,
      userSections: this.store.query('section', {
        ids: user.sections.map((section) => section.sectionId),
      }),
      organizations: this.store.findAll('organization'),
    });
  }
}
