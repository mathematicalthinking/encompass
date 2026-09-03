import AuthenticatedRoute from '../_authenticated_route';
import { action } from '@ember/object';
import { hash } from 'rsvp';
import { service } from '@ember/service';

// A relationship the assignment page can live without. The API only sends back
// the records the current user is allowed to see, so a coalesced find for a
// record they cannot access rejects. Without this, one inaccessible workspace
// rejects the whole model hook and the user lands on the 404 page.
function optional(promise, fallback = null) {
  return Promise.resolve(promise).catch(() => fallback);
}

export default class AssignmentsAssignmentRoute extends AuthenticatedRoute {
  @service store;
  @service currentUser;
  async model(params) {
    const assignment = await this.store.findRecord(
      'assignment',
      params.assignment_id
    );

    const section = await optional(assignment.section);
    const sectionId = section?.id ?? null;
    const isStudent = this.currentUser.isStudent;

    // Students only ever see AssignmentInfoStudent, which needs the problem,
    // the section and their own answers. The rest is teacher-only data that a
    // student has no permission to read - the workspaces created for an
    // assignment belong to their classmates - so asking for it would 404 them
    // out of their own assignment.
    const groups = isStudent
      ? []
      : optional(
          this.store.query('group', {
            section: sectionId,
            isTrashed: false,
          }),
          []
        );

    return hash({
      assignment,
      groups,
      students: isStudent ? [] : optional(assignment.students, []),
      currentProblem: optional(assignment.problem),
      currentSection: section,
      linkedWorkspaces: isStudent
        ? []
        : optional(assignment.linkedWorkspaces, []),
      parentWorkspace: isStudent ? null : optional(assignment.parentWorkspace),
      answers: optional(assignment.answers, []),
      isStudent,
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
