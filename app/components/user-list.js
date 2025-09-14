import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class UserListComponent extends Component {
  @tracked showDeletedUsers = false;
  @service store;
  @service ('current-user') currentUserService;

  get currentUser() {
    return this.currentUserService.user;
  }

  get organizationName() {
    return this.currentUser.organization?.name ?? '<No Organization>'
  }

  get unauthUsers() {
    const filteredUsers = this.args.users.filter(
      (user) => !user.isTrashed && !user.isAuthorized
    );

    if (this.currentUser.isPdAdmin) {
      const orgUsers = filteredUsers.filter(
        (user) =>
          user.organization?.id === this.currentUser.organization?.id &&
          user.username !== this.currentUser.username
      );
      return this.sortByCreateDateDesc(orgUsers);
    }

    return this.sortByCreateDateDesc(filteredUsers);
  }

  get adminUsers() {
    const filteredAdmins = this.args.users.filter(
      (user) =>
        !user.isTrashed &&
        user.isAuthorized &&
        user.accountType === 'A' &&
        user.username !== this.currentUser.username
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
    const filteredTeachers = this.args.users.filter(
      (user) => !user.isTrashed && user.isAuthorized && user.accountType === 'T'
    );
    if (this.currentUser.isPdAdmin) {
      const orgUsersNotYou = filteredTeachers.filter(
        (user) =>
          user.organization?.id === this.currentUser.organization?.id &&
          user.username !== this.currentUser.username
      );
      return this.sortByCreateDateDesc(orgUsersNotYou);
    }
    return this.sortByCreateDateDesc(filteredTeachers);
  }

  get studentUsers() {
    const filteredStudents = this.users.filter(
      (user) => !user.isTrashed && user.isAuthorized && user.accountType === 'S'
    );
    if (this.currentUser.isPdAdmin) {
      const orgUsersNotYou = filteredStudents.filter(
        (user) =>
          user.organization?.id === this.currentUser.organization?.id &&
          user.username !== this.currentUser.username
      );
      return this.sortByCreateDateDesc(orgUsersNotYou);
    }
    return this.sortByCreateDateDesc(filteredStudents);
  }

  // These are all the students that are in sections you are a teacher of
  get yourStudents() {
    const teacherSections =
      this.currentUser.sections?.filter((section) => section.role === 'teacher') ??
      [];
    const teacherSectionIds = teacherSections.map(
      (section) => section.sectionId
    );

    return this.args.users.filter((user) =>
      user.sections.some(
        (section) =>
          section.role === 'student' &&
          teacherSectionIds.includes(section.sectionId)
      )
    );
  }

  // These are all the users that you have created - filter out duplicates
  get yourUsers() {
    const yourId = this.currentUser.id;
    const yourUsers = this.args.users.filter(
      (user) => user.createdBy?.id === yourId
    );
    return this.sortByCreateDateDesc(yourUsers);
  }

  // These are all the users that are in the same org as you
  get orgUsers() {
    const yourOrgId = this.currentUser.organization?.id;

    const orgUsers = this.args.users.filter(
      (user) =>
        !user.isTrashed &&
        user.organization?.id === yourOrgId &&
        user.accountType &&
        user.accountType !== 'S' &&
        user.username !== this.currentUser.username
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
