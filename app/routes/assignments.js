import AuthenticatedRoute from './_authenticated_route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

/**
 * # Assignments Route
 * @description Route for dealing with all assignment objects
 */
export default class AssignmentsRoute extends AuthenticatedRoute {
  @service store;

  async model() {
    let currentUser = this.modelFor('application');
    let assignments = await this.store.findAll('assignment');
    let filtered = assignments.filter((assignment) => {
      return assignment.id && !assignment.get('isTrashed');
    });
    filtered = filtered.sortBy('createDate').reverse();
    return hash({
      currentUser,
      assignments,
      filtered,
    });
  }
}
