/**
 * # Index Route
 * @description This route is the index route to the application. Its model is creating API calls for data to pass to home-page.hbs, and the child table components of the dashboard.
 * @author Crispina Muriel
 * @since 2.3.0
 */
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
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
  model() {
    const user = this.modelFor('application');
    const assignments = this.store.findAll('assignment');
    const sections = this.store.findAll('section');

    //import workspaces created by current user
    const workspaceCriteria = {
      filterBy: {
        createdBy: user.id,
      },
    };

    const workspaces = this.store.query('workspace', workspaceCriteria);

    return RSVP.hash({ assignments, sections, user, workspaces });
  }
  renderTemplate() {
    this.render('index');
  }
}
