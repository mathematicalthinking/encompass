import AuthenticatedRoute from '../_authenticated_route';
import { action } from '@ember/object';
import { hash } from 'rsvp';

export default class AssignmentsAssignmentRoute extends AuthenticatedRoute {
  async model(params) {
    let currentUser = this.modelFor('application');
    return hash({
      currentUser,
      assignment: await this.store.findRecord(
        'assignment',
        params.assignment_id
      ),
    });
  }
  @action toAnswerInfo(answer) {
    this.transitionTo('answer', answer);
  }
  @action toAssignments() {
    this.transitionTo('assignments');
  }
}
