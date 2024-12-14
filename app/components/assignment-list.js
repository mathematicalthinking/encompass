import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class AssignmentListComponent extends Component {
  @service('utility-methods') utils;
  @service currentUser;

  get user() {
    return this.currentUser.user;
  }

  get userId() {
    return this.user.id;
  }

  get yourList() {
    let yourList = this.args.assignments.filter((assignment) => {
      let assigmentCreatorId = this.utils.getBelongsToId(
        assignment,
        'createdBy'
      );
      return this.userId === assigmentCreatorId && !assignment.get('isTrashed');
    });
    return yourList.sortBy('createDate').reverse();
  }

  get notYourList() {
    let notYourList = this.args.assignments.filter((assignment) => {
      let assigmentCreatorId = this.utils.getBelongsToId(
        assignment,
        'createdBy'
      );
      return this.userId !== assigmentCreatorId && !assignment.get('isTrashed');
    });
    return notYourList.sortBy('createDate').reverse();
  }

  get adminList() {
    return this.notYourList;
  }

  get pdList() {
    return this.notYourList;
  }

  get studentList() {
    return this.user.assignments
      .toArray()
      .filter((assignment) => assignment.name && !assignment.isTrashed)
      .reverse();
  }
}
