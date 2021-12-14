import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class MetricsIndexController extends Controller {
  @service store;
  @service JsonCsv;
  @tracked selectedSection = null;
  @action setSection(value) {
    const userChoice = this.store.peekRecord('section', value);
    if (!userChoice) {
      return;
    }
    this.selectedSection = userChoice;
  }
  get folderCsv(){
    return '';
  }
  get allFolders(){
    const students = this.selectedSection.students.toArray();
    const allStudentWorkspaces = 
  }
}
