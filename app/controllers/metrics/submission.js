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
  submissionsColumns = [
    { name: 'Record', valuePath: 'constructor.modelName' },
    { name: 'Workspace', valuePath: 'workspaces.firstObject.name' },
    { name: 'Text', valuePath: 'text' },
    { name: 'Folder Name', valuePath: 'folder.name' },
    { name: 'Creator', valuePath: 'createdBy.displayName' },
    { name: 'Comment Type', valuePath: 'label' },
  ];
}
