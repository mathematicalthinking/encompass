import AuthenticatedRoute from './_authenticated_route';
import { hash } from 'rsvp';
/**
 * # Assignments Route
 * @description Route for dealing with all assignment objects
 */
export default AuthenticatedRoute.extend({
  model: function () {
    let currentUser = this.modelFor('application');
    let assignments = this.store.findAll('assignment');
    return hash({
      currentUser,
      assignments,
    });
  },
});
