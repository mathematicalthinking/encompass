/**
  * # Index Route
  * @description This route is the index route to the application. Its model is creating API calls for data to pass to home-page.hbs, and the child table components of the dashboard.
  * @author Crispina Muriel
  * @since 2.3.0
*/
Encompass.IndexRoute = Ember.Route.extend({
  model: function () {
    const user = this.modelFor('application');
    const assignments = this.get('store').findAll('assignment');

    //import workspaces created by current user
    const workspaceCriteria = {
      filterBy: {
        createdBy: user.id,
      },
    };

    const workspaces = this.get('store').query('workspace', workspaceCriteria);

    return Ember.RSVP.hash({ assignments, user, workspaces });
  },
  renderTemplate: function () {
    this.render('index');
  }
});
