/**
  * # Workspaces Index Route
  * @description Route to view all workspaces
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */

Encompass.WorkspacesRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    // return this.get('store').findAll('user');
  },

  actions: {
    toCopyWorkspace(workspace) {
      let workspaceId = workspace.get('id');
      this.transitionTo('workspaces.copy', { queryParams: { workspace: workspaceId }});
    },
  }

});
