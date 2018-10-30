/**
  * # Workspaces List Route
  * @description Reusable route to list workspaces
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  */
Encompass.WorkspacesListRoute = Ember.Route.extend({
  templateName:   'workspaces/list',

  filter: function(workspace) {
    return true; //return everything by default, extenders will override this
  },

  model: function() {
    const store = this.get('store');
    const user = this.modelFor('application');
    let workspaceCriteria = {};

    if (!user.get('isAdmin')) {
      workspaceCriteria = {
        filterBy: {
          createdBy: user.id
        }
      };
    }
    return Ember.RSVP.hash({
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

  actions: {
    reload: function() {
      this.refresh();
    }
  }

});
