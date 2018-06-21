'use strict';

/**
  * # Folders Index Route
  * @description Route to view all folders
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */
Encompass.FoldersIndexRoute = Ember.Route.extend({

  model: function model() {
    var store = this.get('store');
    var objs = store.find('folder');
    return objs;
  },

  afterModel: function afterModel(folders, transition) {
    if (folders.length === 1) {
      this.transitionTo('workspaceFolder', folders[0]);
    }
  }

});
//# sourceMappingURL=folders_index_route.js.map
