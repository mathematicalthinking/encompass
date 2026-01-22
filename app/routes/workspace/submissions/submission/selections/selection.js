import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SelectionRoute extends Route {
  @service store;
  @service currentSelection;
  @service router;
  @service('utility-methods') utils;

  async model(params) {
    const { selection_id } = params;

    // Try cache first
    let selection = this.store.peekRecord('selection', selection_id);
    if (!selection) {
      try {
        selection = await this.store.findRecord('selection', selection_id);
      } catch (e) {
        return this._handleMissingSelection();
      }
    }

    // Validate selection belongs to the submission from parent route
    const parent = this.modelFor('workspace.submissions.submission');
    const expectedSubmissionId = parent?.submission?.id;
    const actualSubmissionId = this.utils.getBelongsToId(
      selection,
      'submission'
    );

    if (expectedSubmissionId && actualSubmissionId !== expectedSubmissionId) {
      return this._handleMissingSelection();
    }

    return selection;
  }

  afterModel(model) {
    if (model) {
      this.currentSelection.setSelection(model);
    }
  }

  deactivate() {
    this.currentSelection.clearSelection();
  }

  _handleMissingSelection() {
    // Clear and go back to submission route
    this.currentSelection.clearSelection();
    const parent = this.modelFor('workspace.submissions.submission');
    const submissionId = parent?.submission?.id;
    if (submissionId) {
      this.router.transitionTo(
        'workspace.submissions.submission',
        submissionId
      );
    } else {
      // Fallback: replace to workspace route if submission is not present
      const workspaceId = parent?.workspace?.id;
      if (workspaceId) {
        this.router.transitionTo('workspace.submissions', workspaceId);
      } else {
        this.router.transitionTo('workspaces.index');
      }
    }
    return null;
  }
}
