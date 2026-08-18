import AuthenticatedRoute from './_authenticated_route';
import { hash } from 'rsvp';
import { service } from '@ember/service';

/**
 * # Assignments Route
 * @description Route for dealing with all assignment objects
 */
export default class AssignmentsRoute extends AuthenticatedRoute {
  @service store;
  @service currentUser;
  model() {
    return hash({
      isStudent: this.currentUser.isStudent,
      assignments: this.store.findAll('assignment'),
    });
  }
}
