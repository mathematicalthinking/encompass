import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default class UsersUserRoute extends Route {
  @service store;
  model(params) {
    let currentUser = this.modelFor('application');
    return hash({
      currentUser,
      user: this.store.findRecord('user', params.user_id),
      organizations: this.store.findAll('organization'),
    });
  }
}
