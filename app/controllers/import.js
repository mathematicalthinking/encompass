import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ImportController extends Controller {
  @tracked isCompDirty = false;
  @tracked confirmLeaving = false;

  @action
  toWorkspaces(workspace) {
    if (!workspace?._id) {
      return;
    }

    const firstSubmissionId = workspace.submissions?.[0];
    if (firstSubmissionId) {
      window.location.href = `#/workspaces/${workspace._id}/submissions/${firstSubmissionId}`;
      return;
    }
    window.location.href = `#/workspaces/${workspace._id}/work`;
  }

  @action
  doConfirmLeaving(value) {
    this.confirmLeaving = value;
  }
}
