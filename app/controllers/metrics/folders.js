import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MetricsFoldersController extends Controller {
  @tracked foundFolders = [];
  @tracked searchTerm = '';
  @tracked selectedFolders = [];
  @tracked selectedProblem = null;
  tableColumns = [
    { name: 'Record Type', valuePath: 'constructor.modelName' },
    { name: 'Workspace', valuePath: 'workspace.name' },
    {
      name: 'Problem',
      valuePath: 'workspace.submissions.firstObject.answer.problem.title',
    },
    { name: 'Folder Name', valuePath: 'name' },
    { name: 'Text', valuePath: 'text' },
    { name: 'Student', valuePath: 'student' },
    { name: 'Owner', valuePath: 'createdBy.displayName' },
  ];
  get tableRows() {
    return this.selectedFolders.map((folder) => {
      const workspace = folder.workspace;
      const selections = folder.cleanSelections;
      const selectionsWithComments = selections.map((selection) => {
        const comments = selection.comments;
        const commentsFiltered = comments.map((comment) => {
          return {
            text: comment.text,
            constructor: {
              modelName: 'comment',
            },
          };
        });
        return {
          text: selection.text,
          children: commentsFiltered,
          createdBy: {
            displayName: selection.get('createdBy.displayName'),
          },
          constructor: {
            modelName: 'selection',
          },
          student: selection.get('submission.studentDisplayName'),
        };
      });
      return {
        isCollapsed: true,
        name: folder.name,
        constructor: {
          modelName: folder.constructor.modelName,
        },
        createdBy: {
          displayName: folder.get('createdBy.displayName'),
        },
        children: selectionsWithComments,
        workspace: workspace,
      };
    });
  }
  get names() {
    return this.model.folders
      .mapBy('name')
      .filter((name, idx, array) => array.indexOf(name) === idx);
  }
  @action searchFoldersByName() {
    this.foundFolders = this.model.folders.filter(
      (folder) => folder.name.toLowerCase() === this.searchTerm.toLowerCase()
    );
    this.selectedFolders = [];
  }
  @action updateSelectedFolders(folder) {
    if (this.selectedFolders.includes(folder)) {
      return this.selectedFolders.removeObject(folder);
    }
    this.selectedFolders.addObject(folder);
  }
  @action updateSelectedProblem(problem) {
    this.selectedProblem = problem;
  }
}
