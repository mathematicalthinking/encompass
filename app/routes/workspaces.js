/**
 * # Workspaces Index Route
 * @description Route to view all workspaces
 * @author Amir Tahvildaran <amir@mathforum.org>
 * @since 1.0.0
 */

import AuthenticatedRoute from './_authenticated_route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WorkspacesRoute extends AuthenticatedRoute {
  @service router;
  @action toCopyWorkspace(workspace) {
    let workspaceId = workspace.get('id');
    this.router.transitionTo('workspaces.copy', {
      queryParams: { workspace: workspaceId },
    });
  }
}
