/**
  * # Folders Index Route
  * @description Route to view all folders
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */
import Route from '@ember/routing/route';






export default Route.extend({

  model: function () {
    var store = this.store;
    var objs = store.find('folder');
    return objs;
  },

  afterModel: function (folders, transition) {
    if (folders.length === 1) {
      this.transitionTo('workspaceFolder', folders[0]);
    }
  }

});
