import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MetricsFoldersController extends Controller {
  @tracked foundFolders = [];
  @tracked searchTerm = '';
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
}
