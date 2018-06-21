'use strict';

/**
  * # Workspaces List Route
  * @description Reusable route to list workspaces
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  */
Encompass.WorkspacesListRoute = Ember.Route.extend({

  controllerName: 'workspaces.list',
  templateName: 'workspaces/list',

  filter: function filter(workspace) {
    return true; //return everything by default, extenders will override this
  },

  setupController: function setupController(controller, model) {
    this._super(controller, model);
    //controller.set('since', this.store.since('workspace'));
    controller.set('since', new Date());
  },

  model: function model() {
    var route = this;
    var store = this.get('store');

    return store.findAll('workspace');
    /*
    return store.cache('workspace').then(function(model){
      return model;
      //return store.filter('workspace', route.filter.bind(route)); 
      //stackoverflow.com/questions/24439394/emberjs-override-route-filter-without-global/24439468#24439468
    });
    */
  },

  actions: {
    reload: function reload() {
      this.refresh();
    }
  }

});
//# sourceMappingURL=workspaces__list_route.js.map
