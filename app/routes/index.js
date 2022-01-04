/**
 * # Index Route
 * @description This route is the index route to the application. Its model is creating API calls for data to pass to home-page.hbs, and the child table components of the dashboard.
 * @author Crispina Muriel, Tim Leonard
 * @since 2.3.0
 */
import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service store;
  beforeModel() {
    // super.apply(this, arguments);
    this.authenticate();
  }
  authenticate() {
    //this is duplicated here,AuthentecatedRoute, and in ApplicationRoute
    var user = this.modelFor('application');
    if (!user.get('isAuthenticated')) {
      this.store.unloadAll();
      this.transitionTo('auth.login');
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
    //this fixes a bug to have user's responseThreads in store when navigating directly to response
    this.store.query('responseThread', {
      threadType: 'all',
      page: 1,
      limit: 50,
    });
    const user = this.modelFor('application');
    //user.sections isn't reliable. have to query all sections
    const sections = await this.store.findAll('section');
    //if user is admin will receive all sections. otherwise should be filtered already according to user role
    const teacherSections = sections.filter((section) => {
      const teachers = section.teachers;
      return teachers.includes(user);
    });
    const studentSections = sections.filter((section) => {
      const students = section.students;
      return students.includes(user);
    });
    const teacherAssignments = teacherSections.map((section) => {
      const sectionAssignments = section.assignments.toArray();
      return sectionAssignments;
    });
    const studentAssignments = studentSections.map((section) => {
      const sectionAssignments = section.assignments.toArray();
      return sectionAssignments;
    });
    //TODO: find responses given to a user and responses for user to review
    const responses = this.store.query('response', {
      filterBy: { createdBy: user.id },
    });
    const responsesReceived = this.store.query('response', {
      filterBy: { recipient: user.id },
    });
    const collabWorkspaces = user.collabWorkspaces.length
      ? await this.store.query('workspace', {
          filterBy: { _id: { $in: user.collabWorkspaces } },
        })
      : [];
    //import workspaces created by current user
    const workspaceCriteria = {
      filterBy: {
        owner: user.id,
      },
    };
    const createdByCriteria = {
      filterBy: {
        createdBy: user.id,
      },
    };

    const ownedWorkspaces = await this.store.query(
      'workspace',
      workspaceCriteria
    );
    const createdWorkspaces = await this.store.query(
      'workspace',
      createdByCriteria
    );
    return hash({
      teacherSections: teacherAssignments.flat(),
      studentSections: studentAssignments.flat(),
      user,
      workspaces: ownedWorkspaces,
      responses,
      responsesReceived,
      collabWorkspaces,
      createdWorkspaces,
    });
  }
}
