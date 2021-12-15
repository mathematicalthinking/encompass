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
  get folderCsv() {
    if (this.selectedSection) {
      const assignments = this.selectedSection.get('assignments').toArray();
      const assignmentsWorkspaces = assignments.map((assignment) =>
        assignment.get('linkedWorkspaces').toArray()
      );
      const folders = assignmentsWorkspaces
        .flat()
        .map((workspace) => workspace.get('folders').toArray());
      const taggings = folders
        .flat()
        .map((folder) => folder.get('taggings').toArray());
      const formatted = taggings.flat().map((tagging) => {
        return {
          workspace: tagging.get('workspace.name'),
          folder: tagging.get('folder.name'),
          selection: tagging.get('selection.text'),
          mentor: tagging.get('createdBy.username'),
          student: tagging.get('selection.submission.student'),
          actionDate: tagging.createDate,
        };
      });
      return this.JsonCsv.arrayToCsv(formatted);
    }
    return '';
  }
}
