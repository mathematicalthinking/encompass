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
    { name: 'Record', valuePath: 'modelName' },
    { name: 'Workspace', valuePath: 'workspaceName' },
    { name: 'Text/Folder Name', valuePath: 'text' },
    // { name: 'Folder Name', valuePath: 'folder.name' },
    { name: 'Creator', valuePath: 'creator.displayName' },
    // { name: 'Comment Type', valuePath: 'label' },
  ];
  get tableRows() {
    return this.selectedWorkspaces.map((workspace) => {
      const selections = workspace.get('selections');
      const selectionsArray = selections.map((selection) => {
        const folders = selection.get('folders').toArray();
        const comments = selection.get('comments').toArray();
        const foldersArray = folders.map((folder) => {
          return {
            modelName: 'folder',
            text: folder.get('name'),
            creator: folder.get('createdBy'),
          };
        });
        const commentsArray = comments.map((comment) => {
          return {
            modelName: comment.constructor.modelName,
            text: comment.text,
            creator: comment.get('createdBy'),
          };
        });
        return {
          modelName: selection.constructor.modelName,
          text: selection.text,
          creator: selection.get('createdBy'),
          children: [...foldersArray, ...commentsArray],
        };
      });
      return {
        modelName: workspace.constructor.modelName,
        workspaceName: workspace.get('workspaces.firstObject.name'),
        text: 'See Above',
        creator: workspace.get('createdBy'),
        children: selectionsArray,
        id: workspace.id,
      };
    });
  }
}
