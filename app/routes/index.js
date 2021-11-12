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
    const user = this.modelFor('application');
    //user.sections is array of objects {sectionId, role} not direct references to section documents in Ember Data
    const userSections = await Promise.all(
      user.sections.map(async ({ sectionId, role }) => {
        const section = await this.store.findRecord('section', sectionId);
        const assignments = await section.assignments;
        return {
          section,
          assignments,
          role,
        };
      })
    );
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

    const workspaces = await this.store.query('workspace', workspaceCriteria);
    return hash({
      userSections,
      user,
      workspaces,
      responses,
      responsesReceived,
      collabWorkspaces,
    });
  }
}
