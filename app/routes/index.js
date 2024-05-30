import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service store;

  beforeModel() {
    this.authenticate();
  }

  authenticate() {
    const user = this.modelFor('application');
    if (!user.get('isAuthenticated')) {
      this.store.unloadAll();
      this.transitionTo('welcome');
    } else if (
      user.get('email') &&
      !user.get('isEmailConfirmed') &&
      !user.get('isStudent')
    ) {
      this.transitionTo('unconfirmed');
    } else if (!user.get('isAuthz')) {
      this.transitionTo('unauthorized');
    }
  }

  async model() {
    const user = this.modelFor('application');

    const sections = await this.store.findAll('section');
    const teacherSections = sections.filter((section) =>
      section.teachers.includes(user)
    );
    const studentSections = sections.filter((section) =>
      section.students.includes(user)
    );
    const teacherAssignments = teacherSections.map((section) =>
      section.assignments.toArray()
    );
    const studentAssignments = studentSections.map((section) =>
      section.assignments.toArray()
    );
    const teacherClasses = user.sections.map((section) => section.sectionId);
    const filteredClasses = sections.filter((section) =>
      teacherClasses.includes(section.id)
    );
    const responses = await this.store.query('response', {
      filterBy: { createdBy: user.id },
    });
    const responsesReceived = await this.store.query('response', {
      filterBy: { recipient: user.id },
    });
    const collabWorkspaces = user.collabWorkspaces.length
      ? await this.store.query('workspace', {
          filterBy: { _id: { $in: user.collabWorkspaces } },
        })
      : [];
    const workspaceCriteria = { filterBy: { owner: user.id } };
    const createdByCriteria = { filterBy: { createdBy: user.id } };
    const ownedWorkspaces = await this.store.query(
      'workspace',
      workspaceCriteria
    );
    const createdWorkspaces = await this.store.query(
      'workspace',
      createdByCriteria
    );

    return {
      teacherSections: teacherAssignments.flat(),
      studentSections: studentAssignments.flat(),
      user,
      filteredClasses,
      teacherClasses,
      workspaces: ownedWorkspaces,
      responses,
      responsesReceived,
      collabWorkspaces,
      createdWorkspaces,
    };
  }
}
