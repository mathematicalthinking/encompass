/**
 * # Workspaces Index Route
 * @description Route to view all workspaces
 * @author Amir Tahvildaran <amir@mathforum.org>
 * @since 1.0.0
 */
import { hash } from 'rsvp';
import AuthenticatedRoute from '../_authenticated_route';

export default AuthenticatedRoute.extend({
  model: function () {
    const store = this.store;
    const user = this.modelFor('application');
    let workspaceCriteria = {};

    if (!user.get('isAdmin')) {
      workspaceCriteria = {
        filterBy: {
          createdBy: user.id,
        },
      };
    }
    return hash({
      currentUser: user,
      organizations: store.findAll('organization'),
      workspaces: store.query('workspace', workspaceCriteria),
    });
    /*
    return store.cache('workspace').then(function(model){
      return model;
      //return store.filter('workspace', route.filter.bind(route));
      //stackoverflow.com/questions/24439394/emberjs-override-route-filter-without-global/24439468#24439468
    });
    */
  },

  renderTemplate: function () {
    this.render('workspaces/workspaces');
  },

  actions: {
    reload: function () {
      this.refresh();
    },
  },
});
