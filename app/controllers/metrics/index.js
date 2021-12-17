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
  @tracked sectionData = [];
  @tracked isLoadingSection = false;
  @tracked isLoadingUser = false;
  //using .toArray() in the route model hook wasn't working correctly for some reason
  get usersList() {
    return this.model.users.toArray();
  }
  @action async setSection(value) {
    this.isLoadingSection = true;
    const userChoice = this.store.peekRecord('section', value);
    if (!userChoice) {
      return;
    }
    this.selectedSection = userChoice;
    const selections = await this.store.query('selection', {
      metrics: { section: value },
    });
    this.sectionData = await Promise.all(
      selections.toArray().map(async (selection) => {
        const workspace = await selection.get('workspace');
        const submission = await selection.get('submission');
        const taggings = await selection.get('taggings');
        const folders = await Promise.all(
          taggings.toArray().map(async (tagging) => await tagging.get('folder'))
        );
        return {
          workspace: workspace.name,
          selection: selection.text,
          mentor: selection.get('createdBy.username'),
          student: submission.student,
          folders: folders
            .map((folder) => {
              return folder ? folder.name : '';
            })
            .join('; '),
          actionDate: moment(selection.createDate).format('MM/DD/YY hh:mm:ss'),
        };
      })
    );
    this.isLoadingSection = false;
  }
  @action async setUser(value) {
    this.isLoadingUser = true;
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
        const folders = await Promise.all(
          taggings.toArray().map(async (tagging) => await tagging.get('folder'))
        );
        return {
          workspace: workspace.name,
          selection: selection.text,
          mentor: selection.get('createdBy.username'),
          student: submission.student,
          folders: folders
            .map((folder) => {
              return folder ? folder.name : '';
            })
            .join('; '),
          actionDate: moment(selection.createDate).format('MM/DD/YY hh:mm:ss'),
        };
      })
    );
    this.isLoadingUser = false;
  }
  get folderCsv() {
    return this.JsonCsv.arrayToCsv(this.sectionData);
  }
  get singleUserFolders() {
    return this.JsonCsv.arrayToCsv(this.userData);
  }
}
