'use strict';

/**
  * # Workspaces Mine Route
  * @description Route to view all workspaces
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */
Encompass.WorkspacesMineRoute = Encompass.WorkspacesListRoute.extend({

  filter: function filter(workspace) {
    return this.modelFor('application') === workspace.get('owner');
  }

});
//# sourceMappingURL=workspaces_mine_route.js.map
