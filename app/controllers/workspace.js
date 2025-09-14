/**
 * # Workspace Controller
 * @description This controller for the workspace assists in linking between submissions
 * @todo Linking between submissions should really be moved to workspace_submissions_index_controller
 * @since 1.0.0
 */
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class WorkspaceController extends Controller {
  get showOverlay() {
    return this.makingSelection || this.taggingSelection;
  }

  @action
  popupMaskClicked() {
    this.transitionToRoute(
      'workspace.submissions.submission',
      this.currentSubmission
    );
  }
}
