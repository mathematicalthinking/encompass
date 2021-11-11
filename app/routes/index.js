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
    // school year start is most recent August
    const schoolYearStart =
      new Date(new Date().getFullYear(), 7).getTime() < new Date().getTime()
        ? new Date(new Date().getFullYear(), 7)
        : new Date(new Date().getFullYear() - 1, 7);
    const user = this.modelFor('application');
    //user.sections is array of objects {sectionId, role} not direct references to courses
    const userSections = await Promise.all(
      user.sections.map(async ({ sectionId, role }) => {
        const data = await this.store.findRecord('section', sectionId);
        return {
          data,
          role,
        };
      })
    );
    //active sections were created within current school year
    const activeSections = userSections.filter(
      (section) => section.data.createDate.getTime() > schoolYearStart.getTime()
    );
    const responses = this.store.query('response', {
      filterBy: { createdBy: user.id },
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

    const workspaces = await this.store.query('workspace', workspaceCriteria);
    const activeWorkspaces = workspaces.filter(
      (workspace) =>
        workspace.lastModifiedDate.getTime() > schoolYearStart.getTime() ||
        workspace.createDate.getTime() > schoolYearStart.getTime()
    );
    console.log(activeWorkspaces);
    const activeCollabWorkspaces = collabWorkspaces.filter(
      (workspace) =>
        workspace.lastModifiedDate.getTime() > schoolYearStart.getTime()
    );
    return hash({
      activeSections,
      user,
      workspaces,
      activeWorkspaces,
      activeCollabWorkspaces,
      responses,
      collabWorkspaces,
    });
  }
}
