/**
 * # Workspaces Index Controller
 * @description Controller to view all workspaces
 */

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WorkspacesIndexController extends Controller {
  @service router;

  @action toCopyWorkspace(workspace) {
    let workspaceId = workspace.get('id');
    this.router.transitionTo('workspaces.copy', {
      queryParams: { workspace: workspaceId },
    });
  }
}
