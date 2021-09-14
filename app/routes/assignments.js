import AuthenticatedRoute from './_authenticated_route';
import { hash } from 'rsvp';
/**
 * # Assignments Route
 * @description Route for dealing with all assignment objects
 */
export default class AssignmentsRoute extends AuthenticatedRoute {
  async model() {
    let currentUser = this.modelFor('application');
    let assignments = await this.store.findAll('assignment');
    return hash({
      currentUser,
      assignments,
    });
  }
}
