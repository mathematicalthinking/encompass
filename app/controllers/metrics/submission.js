import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MetricsSubmissionController extends Controller {
  @tracked showWorkspaces = false;
  @tracked selectedWorkspaces = [];
  @action toggleShowWorkspaces() {
    this.showWorkspaces = !this.showWorkspaces;
  }
  @action updateSelectedWorkspaces(workspace) {
    if (this.selectedWorkspaces.includes(workspace)) {
      return this.selectedWorkspaces.removeObject(workspace);
    }
    return this.selectedWorkspaces.pushObject(workspace);
  }
}
