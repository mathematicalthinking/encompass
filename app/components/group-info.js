import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class GroupInfoComponent extends Component {
  @service sweetAlert;

  @tracked displayStudents = false;
  @tracked updateGroup = false;
  @tracked draftName = '';
  @tracked draftStudents = [];
  studentsChanged = false;

  get showStudents() {
    return this.args.addGroup || this.displayStudents;
  }
  get isUpdating() {
    return this.args.addGroup && this.updateGroup;
  }
  get groupStudents() {
    if (this.isUpdating) {
      return this.draftStudents;
    }

    return this.args.group.students.slice();
  }

  syncDraftGroup() {
    this.draftName = this.args.group.name;
    this.draftStudents = [...this.args.group.students.slice()];
    this.studentsChanged = false;
  }

  resetDraftGroup() {
    this.draftName = '';
    this.draftStudents = [];
    this.studentsChanged = false;
  }

  @action
  toggleUpdateGroup() {
    this.updateGroup = !this.updateGroup;
  }

  @action
  addStudent(student) {
    if (this.groupStudents.includes(student)) {
      this.draftStudents = this.draftStudents.filter(
        (member) => member !== student
      );
      this.studentsChanged = true;
      return;
    }

    this.draftStudents = [...this.draftStudents, student];
    this.studentsChanged = true;
  }

  @action
  updateDraftName(event) {
    this.draftName = event.target.value;
  }

  @action
  handleTrash(student) {
    if (this.args.updateGroup) {
      this.args.updateGroup(this.args.group, student);
    }
  }
  @action
  toggleDisplayStudents() {
    this.displayStudents = !this.displayStudents;
  }
  @action
  async editButton() {
    if (!this.isUpdating) {
      this.syncDraftGroup();
      this.toggleUpdateGroup();
      return;
    }

    const hasNameChanges = this.draftName !== this.args.group.name;

    if (hasNameChanges || this.studentsChanged) {
      try {
        await this.args.saveGroup(this.args.group, {
          name: this.draftName,
          students: this.draftStudents,
        });
      } catch (err) {
        console.log(err);
        this.sweetAlert.showToast('error', err);
        return;
      }
    }

    this.resetDraftGroup();
    this.toggleUpdateGroup();
  }
  @action
  cancelButton() {
    if (this.updateGroup) {
      this.args.group.rollbackAttributes();
      this.resetDraftGroup();
      this.toggleUpdateGroup();
    } else {
      this.args.deleteGroup(this.args.group);
    }
  }
}
