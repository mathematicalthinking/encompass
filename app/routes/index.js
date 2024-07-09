import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service store;
  @service router; // Inject router service for transitions
  @service currentUser;
  beforeModel(transition) {
    super.beforeModel(...arguments); // Ensure superclass hooks are called
    this.authenticate();
  }

  authenticate() {
    const user = this.currentUser.user;

    if (!user.get('isAuthenticated')) {
      this.store.unloadAll();
      this.router.transitionTo('welcome'); // Use router service for transitions
    } else if (
      user.get('email') &&
      !user.get('isEmailConfirmed') &&
      !user.get('isStudent')
    ) {
      this.router.transitionTo('unconfirmed');
    } else if (!user.get('isAuthz')) {
      this.router.transitionTo('unauthorized');
    }
  }

  async model() {
    try {
      const user = this.currentUser.user;
      const sections = await this.store.findAll('section');

      const teacherSections = sections.filter((section) =>
        section.teachers.includes(user)
      );

      const studentSections = sections.filter((section) =>
        section.students.includes(user)
      );

      const teacherAssignments = teacherSections.flatMap((section) =>
        section.assignments.toArray()
      );

      const studentAssignments = studentSections.flatMap((section) =>
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

      const ownedWorkspaces = await this.store.query('workspace', {
        filterBy: { owner: user.id },
      });
      const createdWorkspaces = await this.store.query('workspace', {
        filterBy: { createdBy: user.id },
      });

      return {
        teacherSections: teacherAssignments,
        studentSections: studentAssignments,
        user,
        filteredClasses,
        teacherClasses,
        workspaces: ownedWorkspaces,
        responses,
        responsesReceived,
        collabWorkspaces,
        createdWorkspaces,
      };
    } catch (error) {
      console.error('Error loading model:', error);
      throw error; // Rethrow error to let Ember handle it appropriately
    }
  }
}
