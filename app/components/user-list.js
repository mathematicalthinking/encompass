import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class UserListComponent extends Component {
  @tracked showDeletedUsers = false;
  @service store;

  get unauthUsers() {
    const { users, currentUser } = this.args;
    const filteredUsers = users.filter(
      (user) => !user.isTrashed && !user.isAuthorized
    );

    if (currentUser.isPdAdmin) {
      const orgUsers = filteredUsers.filter(
        (user) =>
          user.organization?.id === currentUser.organization?.id &&
          user.username !== currentUser.username
      );
      return this.sortByCreateDateDesc(orgUsers);
    }

    return this.sortByCreateDateDesc(filteredUsers);
  }

  get adminUsers() {
    const { users, currentUser } = this.args;
    const filteredAdmins = users.filter(
      (user) =>
        !user.isTrashed &&
        user.isAuthorized &&
        user.accountType === 'A' &&
        user.username !== currentUser.username
    );

    return this.sortByCreateDateDesc(filteredAdmins);
  }

  get pdUsers() {
    const filteredPdUsers = this.args.users.filter(
      (user) => !user.isTrashed && user.isAuthorized && user.accountType === 'P'
    );
    return this.sortByCreateDateDesc(filteredPdUsers);
  }

  // Getter for teacher users
  get teacherUsers() {
    const { users, currentUser } = this.args;
    const filteredTeachers = users.filter(
      (user) => !user.isTrashed && user.isAuthorized && user.accountType === 'T'
    );
    if (currentUser.isPdAdmin) {
      const orgUsersNotYou = filteredTeachers.filter(
        (user) =>
          user.organization?.id === currentUser.organization?.id &&
          user.username !== currentUser.username
      );
      return this.sortByCreateDateDesc(orgUsersNotYou);
    }
    return this.sortByCreateDateDesc(filteredTeachers);
  }

  get studentUsers() {
    const { users, currentUser } = this.args;
    const filteredStudents = users.filter(
      (user) => !user.isTrashed && user.isAuthorized && user.accountType === 'S'
    );
    if (currentUser.isPdAdmin) {
      const orgUsersNotYou = filteredStudents.filter(
        (user) =>
          user.organization?.id === currentUser.organization?.id &&
          user.username !== currentUser.username
      );
      return this.sortByCreateDateDesc(orgUsersNotYou);
    }
    return this.sortByCreateDateDesc(filteredStudents);
  }

  // These are all the students that are in sections you are a teacher of
  get yourStudents() {
    const { users, currentUser } = this.args;
    const teacherSections =
      currentUser.sections?.filter((section) => section.role === 'teacher') ??
      [];
    const teacherSectionIds = teacherSections.map(
      (section) => section.sectionId
    );

    return users.filter((user) =>
      user.sections.some(
        (section) =>
          section.role === 'student' &&
          teacherSectionIds.includes(section.sectionId)
      )
    );
  }

  // These are all the users that you have created - filter out duplicates
  get yourUsers() {
    const yourId = this.args.currentUser.id;
    const yourUsers = this.args.users.filter(
      (user) => user.createdBy?.id === yourId
    );
    return this.sortByCreateDateDesc(yourUsers);
  }

  // These are all the users that are in the same org as you
  get orgUsers() {
    const { users, currentUser } = this.args;
    const yourOrgId = currentUser.organization?.id;

    const orgUsers = users.filter(
      (user) =>
        !user.isTrashed &&
        user.organization?.id === yourOrgId &&
        user.accountType &&
        user.accountType !== 'S' &&
        user.username !== currentUser.username
    );

    return this.sortByCreateDateDesc(orgUsers);
  }

  // Helper method to sort by create date in descending order
  sortByCreateDateDesc(users) {
    return users.sort((a, b) => {
      const dateA = new Date(a.createDate);
      const dateB = new Date(b.createDate);
      return dateB - dateA;
    });
  }

  @action
  toggleDeletedUsers() {
    this.showDeletedUsers = !this.showDeletedUsers;
  }
}
