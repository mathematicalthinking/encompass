/**
 * # Workspace Controller
 * @description This controller for the workspace assists in linking between submissions
 * @todo Linking between submissions should really be moved to workspace_submissions_index_controller
 * @since 1.0.0
 */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
export default class WorkspaceController extends Controller {
  @service router;
  get showOverlay() {
    return this.makingSelection || this.taggingSelection;
  }

  @action
  popupMaskClicked() {
    this.router.transitionTo('workspace.submission', this.currentSubmission);
  }
}
