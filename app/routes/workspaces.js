/**
 * # Workspaces Index Route
 * @description Route to view all workspaces
 * @author Amir Tahvildaran <amir@mathforum.org>
 * @since 1.0.0
 */

import AuthenticatedRoute from './_authenticated_route';

export default AuthenticatedRoute.extend({
  model: function () {
    // return this.store').findAll('user;
  },

  actions: {
    toCopyWorkspace(workspace) {
      let workspaceId = workspace.get('id');
      this.transitionTo('workspaces.copy', {
        queryParams: { workspace: workspaceId },
      });
    },
  },
});
