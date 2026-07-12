/**
 * # Workspaces Copy Controller
 * @description Controller for the copy-workspace wizard
 */

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WorkspacesCopyController extends Controller {
  @service router;

  @action toWorkspace(id) {
    this.router.transitionTo('workspace.work', id);
  }
}
