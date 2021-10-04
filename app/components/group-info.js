import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GroupInfoComponent extends Component {
  @service store;
  get showStudents() {
    return this.args.addGroup || this.displayStudents;
  }
  @tracked displayStudents = false;
  @action toggleDisplayStudents() {
    this.displayStudents = !this.displayStudents;
  }
}
