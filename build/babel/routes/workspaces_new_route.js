'use strict';

Encompass.WorkspacesNewRoute = Ember.Route.extend({

  model: function model() {
    var store = this.get('store');
    var pdSets = store.findAll('PdSet');
    var folderSets = store.findAll('folderSet');

    return { pdSets: pdSets, folderSets: folderSets };
  },

  actions: {
    // willTransition: function() {
    //   this.send('reload');
    // }
  }
});
//# sourceMappingURL=workspaces_new_route.js.map
