'use strict';

/**
  * # Workspace Submissions Route
  * @description This route resolves the submissions for the workspace
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  */
Encompass.WorkspaceFoldersRoute = Ember.Route.extend({

  model: function model() {
    var workspace = this.modelFor('workspace');
    return workspace.get('folders');
  }
});
//# sourceMappingURL=workspace_folders_route.js.map
