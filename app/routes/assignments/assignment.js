import AuthenticatedRoute from '../_authenticated_route';
import { action } from '@ember/object';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
export default class AssignmentsAssignmentRoute extends AuthenticatedRoute {
  @service store;
  @service router;
  async model(params) {
    const assignment = await this.store.findRecord(
      'assignment',
      params.assignment_id
    );

    const section = await assignment.section;
    const sectionId = section?.id ?? null;
    const groups = this.store.query('group', {
      section: sectionId,
      isTrashed: false,
    });
    return hash({
      assignment,
      groups,
      students: assignment.students,
      sections: this.store.findAll('section'),
    });
  }
  @action toAssignments() {
    this.router.transitionTo('assignments');
  }
}
