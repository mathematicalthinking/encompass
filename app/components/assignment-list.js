import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class AssignmentListComponent extends Component {
  @service('utility-methods') utils;

  get yourList() {
    let currentUser = this.args.currentUser;
    let yourList = this.args.assignments.filter((assignment) => {
      let userId = currentUser.get('id');
      let assigmentCreatorId = this.utils.getBelongsToId(
        assignment,
        'createdBy'
      );
      return userId === assigmentCreatorId && !assignment.get('isTrashed');
    });
    return yourList.sortBy('createDate').reverse();
  }

  get adminList() {
    let currentUser = this.args.currentUser;
    let adminList = this.args.assignmentList.filter((assignment) => {
      let userId = currentUser.get('id');
      let assigmentCreatorId = this.utils.getBelongsToId(
        assignment,
        'createdBy'
      );
      return userId !== assigmentCreatorId && !assignment.get('isTrashed');
    });
    return adminList.sortBy('createDate').reverse();
  }

  get pdList() {
    let currentUser = this.args.currentUser;
    let pdList = this.args.assignmentList.filter((assignment) => {
      let userId = currentUser.get('id');
      let assigmentCreatorId = this.utils.getBelongsToId(
        assignment,
        'createdBy'
      );
      return userId !== assigmentCreatorId && !assignment.get('isTrashed');
    });
    return pdList.sortBy('createDate').reverse();
  }

  get studentList() {
    let currentUser = this.args.currentUser;
    return currentUser
      .get('assignments')
      .toArray()
      .filter((assignment) => assignment.name && !assignment.isTrashed)
      .reverse();
  }
}
