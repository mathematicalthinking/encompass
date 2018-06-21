'use strict';

/**
  * # Workspaces Mine Route
  * @description Route to view all workspaces
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */
Encompass.WorkspacesPublicRoute = Encompass.WorkspacesListRoute.extend({

  filter: function filter(workspace) {
    return 'public' === workspace.get('mode');
  }

});
//# sourceMappingURL=workspaces_public_route.js.map
