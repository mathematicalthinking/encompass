import { hash } from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from '../_authenticated_route';

export default class WorkspacesCopyRoute extends AuthenticatedRoute {
  @service store;
  @service router;
  workspaceToCopy = null;
  workspaceId = null;
  beforeModel(transition) {
    if (transition.intent.queryParams) {
      this.workspaceId = transition.intent.queryParams.workspace;
    }
  }

  model() {
    const store = this.store;
    this.workspaceToCopy = this.workspaceId;
    return hash({
      folderSets: store.findAll('folderSet'),
      workspaceToCopy: this.workspaceId,
    });
  }

  @action toWorkspace(id) {
    this.router.transitionTo('workspace.work', id);
  }
}
