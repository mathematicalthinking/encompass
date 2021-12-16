import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import moment from 'moment';

export default class MetricsIndexController extends Controller {
  @service store;
  @service JsonCsv;
  @tracked selectedSection = null;
  @tracked selectedUser = null;
  @tracked userData = [];
  @tracked isLoading = false;
  //using .toArray() in the route model hook wasn't working correctly for some reason
  get usersList() {
    return this.model.users.toArray();
  }
  @action setSection(value) {
    const userChoice = this.store.peekRecord('section', value);
    if (!userChoice) {
      return;
    }
    this.selectedSection = userChoice;
  }
  @action async setUser(value) {
    this.isLoading = true;
    const userChoice = this.store.peekRecord('user', value);
    if (!userChoice) {
      return;
    }
    this.selectedUser = userChoice;
    const selections = await this.store.query('selection', {
      metrics: { user: value },
    });
    this.userData = await Promise.all(
      selections.toArray().map(async (selection) => {
        const workspace = await selection.get('workspace');
        const submission = await selection.get('submission');
        const taggings = await selection.get('taggings');
        const folders = await taggings.mapBy('folder');
        console.log(folders.mapBy('name'));
        return {
          workspace: workspace.name,
          folder: await folders.mapBy('name'),
          selection: selection.text,
          mentor: selection.get('createdBy.username'),
          student: submission.student,
          actionDate: moment(selection.createDate).format('MM/DD/YY hh:mm:ss'),
        };
      })
    );
    this.isLoading = false;
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
  get singleUserFolders() {
    return this.JsonCsv.arrayToCsv(this.userData);
  }
}
