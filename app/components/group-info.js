import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GroupInfoComponent extends Component {
  @service store;
  @service sweetAlert;
  get showStudents() {
    return this.args.addGroup || this.displayStudents;
  }
  @tracked displayStudents = false;
  @tracked updateGroup = false;
  studentsChanged = false;
  @action toggleUpdateGroup() {
    this.updateGroup = !this.updateGroup;
  }
  get isUpdating() {
    return this.args.addGroup && this.updateGroup;
  }
  get groupStudents() {
    return this.args.group.students.toArray();
  }
  @action addStudent(student) {
    this.studentsChanged = true;
    if (this.groupStudents.includes(student)) {
      return this.args.group.students.removeObject(student);
    }
    return this.args.group.students.pushObject(student);
  }
  @action toggleDisplayStudents() {
    this.displayStudents = !this.displayStudents;
  }
  @action async editButton() {
    if (this.args.group.hasDirtyAttributes || this.studentsChanged) {
      try {
        await this.args.group.save();
        this.sweetAlert.showToast();
      } catch (err) {
        console.log(err);
        this.sweetAlert.showToast('error', err);
      }
    }
    this.toggleUpdateGroup();
  }
  @action cancelButton() {
    if (this.updateGroup) {
      this.args.group.rollbackAttributes();
      this.studentsChanged = false;
      this.toggleUpdateGroup();
    } else {
      this.args.deleteGroup(this.args.group);
    }
  }
}
