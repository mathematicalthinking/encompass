
/**
  * # Index Route
  * @description This route is the index route to the application. Its model is creating API calls for data to pass to home-page.hbs, and the child table components of the dashboard.
  * @author Crispina Muriel
  * @since 2.3.0
*/

Encompass.IndexRoute = Ember.Route.extend({
    beforeModel: function() {
    this._super.apply(this, arguments);
    this.authenticate();
  },
  authenticate: function() { //this is duplicated here,AuthentecatedRoute, and in ApplicationRoute
    var user = this.modelFor('application');
    if(!user.get('isAuthenticated')) {
      this.get('store').unloadAll();
      this.transitionTo('auth.login');
    }else if (user.get('email') && !user.get('isEmailConfirmed') && !user.get('isStudent')) {
      this.transitionTo('unconfirmed');
    }else if(!user.get('isAuthz')) {
      this.transitionTo('unauthorized');
    }
  },
  model: function () {
    const user = this.modelFor('application');
    const assignments = this.get('store').findAll('assignment');
    const sections = this.get('store').findAll('section');

    //import workspaces created by current user
    const workspaceCriteria = {
      filterBy: {
        owner: user.id,
      },
    };

    const workspaces = this.get('store').query('workspace', workspaceCriteria);

    return Ember.RSVP.hash({ assignments, sections, user, workspaces });
  },
  renderTemplate: function () {
    this.render('index');
  }
});
