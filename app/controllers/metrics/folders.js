import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MetricsFoldersController extends Controller {
  @tracked foundFolders = [];
  @tracked searchTerm = '';
  @tracked selectedFolders = [];
  tableColumns = [
    { name: 'Record Type', valuePath: 'constructor.modelName' },
    { name: 'Name', valuePath: 'name' },
    { name: 'Owner', valuePath: 'createdBy.displayName' },
    { name: 'Workspace', valuePath: 'workspace.name' },
    { name: 'Text', valuePath: 'text' },
  ];
  get tableRows() {
    return this.selectedFolders.map((folder) => {
      const selections = folder.cleanSelections;
      return {
        name: folder.name,
        constructor: {
          modelName: folder.constructor.modelName,
        },
        createdBy: {
          displayName: folder.get('createdBy.displayName'),
        },
        children: selections,
      };
    });
  }
  get names() {
    return this.model
      .mapBy('name')
      .filter((name, idx, array) => array.indexOf(name) === idx);
  }
  @action searchFoldersByName() {
    this.foundFolders = this.model.filter(
      (folder) => folder.name.toLowerCase() === this.searchTerm.toLowerCase()
    );
  }
  @action updateSelectedFolders(folder) {
    if (this.selectedFolders.includes(folder)) {
      return this.selectedFolders.removeObject(folder);
    }
    this.selectedFolders.addObject(folder);
  }
}
