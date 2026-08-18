import Component from '@glimmer/component';
import { service } from '@ember/service';

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
    const yourList = this.args.assignments.filter((assignment) => {
      const assignmentCreatorId = this.utils.getBelongsToId(
        assignment,
        'createdBy'
      );
      return this.userId === assignmentCreatorId && !assignment.isTrashed;
    });
    return yourList.sortBy('createDate').reverse();
  }

  get notYourList() {
    const notYourList = this.args.assignments.filter((assignment) => {
      const assignmentCreatorId = this.utils.getBelongsToId(
        assignment,
        'createdBy'
      );
      return this.userId !== assignmentCreatorId && !assignment.isTrashed;
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
      .slice()
      .filter((assignment) => assignment.name && !assignment.isTrashed)
      .reverse();
  }

  get organizationName() {
    return this.user.organization?.name ?? 'No Organization';
  }
}
