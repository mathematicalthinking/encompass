import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import isNull from 'lodash-es/isNull';

export default class WsCopyWorkspaceComponent extends Component {
  @service('utility-methods') utils;
  @service store;

  @tracked missingWorkspace = false;
  @tracked tooFewSubmissions = false;

  // seed the selectize with the already-chosen workspace (e.g. arrived from the
  // workspace list, or stepped back into this step). @selectedWorkspace is owned
  // by the parent.
  get initialWorkspaceItem() {
    const selectedWorkspace = this.args.selectedWorkspace;
    if (this.utils.isNonEmptyObject(selectedWorkspace)) {
      return [selectedWorkspace.id];
    }
    return [];
  }

  get initialWorkspaceOptions() {
    const selectedWorkspace = this.args.selectedWorkspace;
    if (this.utils.isNonEmptyObject(selectedWorkspace)) {
      return [
        {
          id: selectedWorkspace.id,
          name: selectedWorkspace.get('name'),
        },
      ];
    }
    return [];
  }

  @action
  setSelectedWorkspace(val, item) {
    if (!val) {
      return;
    }

    // removal from the selectize
    if (isNull(item)) {
      this.args.onSelectWorkspace(null);
      return;
    }

    const workspace = this.store.peekRecord('workspace', val);
    if (this.utils.isNullOrUndefined(workspace)) {
      return;
    }

    this.args.onSelectWorkspace(workspace);
    this.missingWorkspace = false;
  }

  @action
  next() {
    const workspace = this.args.selectedWorkspace;

    // a workspace is required to move on
    if (this.utils.isNonEmptyObject(workspace)) {
      const submissionsLength = workspace.get('submissionsLength');

      // only workspaces with at least one submission can be copied
      if (submissionsLength > 0) {
        this.args.onProceed();
        return;
      }
      this.tooFewSubmissions = true;
      return;
    }

    this.missingWorkspace = true;
  }

  @action
  resetMissingWorkspace() {
    this.missingWorkspace = false;
  }

  @action
  resetTooFewSubmissions() {
    this.tooFewSubmissions = false;
  }
}
