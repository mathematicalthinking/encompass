import AuthenticatedRoute from '../_authenticated_route';
import { action } from '@ember/object';
import { hash } from 'rsvp';

export default class AssignmentsAssignmentRoute extends AuthenticatedRoute {
  async model(params) {
    let currentUser = this.modelFor('application');
    const assignment = await this.store.findRecord(
      'assignment',
      params.assignment_id
    );
    const section = await assignment.get('section.id');
    const groups = await this.store.query('group', {
      section: section,
      isTrashed: false,
    });
    return hash({
      currentUser,
      assignment,
      groups,
    });
  }
  @action toAnswerInfo(answer) {
    this.transitionTo('answer', answer);
  }
  @action toAssignments() {
    this.transitionTo('assignments');
  }
}
