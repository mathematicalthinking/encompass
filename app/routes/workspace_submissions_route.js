/**
  * # Workspace Submissions Route
  * @description This route resolves the submissions for the workspace
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  */
Encompass.WorkspaceSubmissionsRoute = Ember.Route.extend({

  model: function() {
    var workspace = this.modelFor('workspace');
    return workspace.get('submissions');
  },

});
