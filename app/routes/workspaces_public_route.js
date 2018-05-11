/**
  * # Workspaces Mine Route
  * @description Route to view all workspaces
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */
Encompass.WorkspacesPublicRoute = Encompass.WorkspacesListRoute.extend({

  filter: function(workspace) {
    return ('public' === workspace.get('mode'));
  }

});
