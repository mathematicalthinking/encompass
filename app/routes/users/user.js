import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class UsersUserRoute extends Route {
  model(params) {
    let currentUser = this.modelFor('application');
    return RSVP.hash({
      currentUser,
      user: this.store.findRecord('user', params.user_id),
    });
  }
}
