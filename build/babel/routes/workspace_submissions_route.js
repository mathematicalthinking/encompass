'use strict';

/**
  * # Workspace Submissions Route
  * @description This route resolves the submissions for the workspace
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  */
Encompass.WorkspaceSubmissionsRoute = Ember.Route.extend({

  model: function model() {
    var workspace = this.modelFor('workspace');
    console.log("Getting submissions W-Ss route: " + workspace.get('id'));
    return workspace.get('submissions');
  }

});
//# sourceMappingURL=workspace_submissions_route.js.map
