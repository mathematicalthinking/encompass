import AuthenticatedRoute from '../_authenticated_route';
import { action } from '@ember/object';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
export default class AssignmentsAssignmentRoute extends AuthenticatedRoute {
  @service store;
  @service router;
  async model(params) {
    let currentUser = this.modelFor('application');
    const assignment = await this.store.findRecord(
      'assignment',
      params.assignment_id
    );
    const sections = await this.store.findAll('section');

    const section = await assignment.get('section.id');
    const groups = await this.store.query('group', {
      section: section,
      isTrashed: false,
    });
    const students = await assignment.get('students');
    return hash({
      currentUser,
      assignment,
      groups,
      students,
      sections,
    });
  }
  @action toAssignments() {
    this.router.transitionTo('assignments');
  }
}
