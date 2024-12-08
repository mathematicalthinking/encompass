/**
 * # Users Route
 * @description Route for dealing with all user objects
 * @todo This is really the users_index route and should be named as such by convention
 * @author Amir Tahvildaran <amir@mathforum.org>, Tim Leonard <tleonard@21pstem.org>
 * @since 1.0.0
 */
import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default class UsersRoute extends Route {
  @service store;
  beforeModel() {
    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.transitionTo('/');
    }
  }
  async model() {
    const currentUser = this.modelFor('application');
    const users = await this.store.findAll('user');
    return hash({
      currentUser,
      users,
      organizations: this.store.findAll('organization'),
      trashedUsers: users.filter((user) => user.isTrashed),
    });
  }
}
