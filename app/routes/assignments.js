import AuthenticatedRoute from './_authenticated_route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

/**
 * # Assignments Route
 * @description Route for dealing with all assignment objects
 */
export default class AssignmentsRoute extends AuthenticatedRoute {
  @service store;

  model() {
    return hash({
      assignments: this.store.findAll('assignment'),
    });
  }
}
