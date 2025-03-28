import AuthenticatedRoute from '../_authenticated_route';
import { action } from '@ember/object';
import { hash } from 'rsvp';
import { service } from '@ember/service';
export default class AssignmentsAssignmentRoute extends AuthenticatedRoute {
  @service store;
  @service router;
  @service currentUser;
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
      currentSection: section,
      currentProblem: assignment.problem,
      groups,
      students: assignment.students,
      sections: this.store.findAll('section'),
      linkedWorkspaces: assignment.linkedWorkspaces,
      parentWorkspace: assignment.parentWorkspace,
      answers: assignment.answers,
      isStudent: this.currentUser.isStudent,
    });
  }

  @action
  async onAnswerCreated(answer) {
    const { assignment } = this.model;
    assignment.answers.pushObject(answer);

    try {
      await assignment.save();
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  }
}
