import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class UserListComponent extends Component {
  @tracked showDeletedUsers = false;
  @service store;

  get unauthUsers() {
    let users = this.args.users.filterBy('isTrashed', false);
    let unauthUsers = users.filterBy('isAuthorized', false);
    if (this.args.currentUser.isPdAdmin) {
      let orgUsersNotYou = unauthUsers
        .filterBy(
          'organization.id',
          this.args.currentUser.get('organization.id')
        )
        .rejectBy('username', this.args.currentUser.user);
      return orgUsersNotYou.sortBy('createDate').reverse();
    }
    return unauthUsers.sortBy('createDate').reverse();
  }

  get adminUsers() {
    let users = this.args.users.filterBy('isTrashed', false);
    let authUsers = users.filterBy('isAuthorized', true);
    let adminUsers = authUsers.filterBy('accountType', 'A');
    let adminUsersNotYou = adminUsers.rejectBy(
      'username',
      this.args.currentUser.username
    );
    return adminUsersNotYou.sortBy('createDate').reverse();
  }

  get pdUsers() {
    let users = this.args.users.filterBy('isTrashed', false);
    let authUsers = users.filterBy('isAuthorized', true);
    let students = authUsers.filterBy('accountType', 'P');
    return students.sortBy('createDate').reverse();
  }

  get teacherUsers() {
    let users = this.args.users.filterBy('isTrashed', false);
    let teacherUsers = users.filterBy('accountType', 'T');
    let authTeachers = teacherUsers.filterBy('isAuthorized', true);
    if (this.args.currentUser.isPdAdmin) {
      let orgUsersNotYou = authTeachers
        .filterBy(
          'organization.id',
          this.args.currentUser.get('organization.id')
        )
        .rejectBy('username', this.args.currentUser.username);
      return orgUsersNotYou.sortBy('createDate').reverse();
    }
    return authTeachers.sortBy('createDate').reverse();
  }

  get studentUsers() {
    let users = this.args.users.filterBy('isTrashed', false);
    let authUsers = users.filterBy('isAuthorized', true);
    let students = authUsers.filterBy('accountType', 'S');
    if (this.args.currentUser.isPdAdmin) {
      let orgUsersNotYou = students
        .filterBy(
          'organization.id',
          this.args.currentUser.get('organization.id')
        )
        .rejectBy('username', this.args.currentUser.username);
      return orgUsersNotYou.sortBy('createDate').reverse();
    }
    return students.sortBy('createDate').reverse();
  }

  get trashedUsers() {
    return this.store.query('user', {
      isTrashed: true,
    });
  }
  // These are all the students that are in sections you are a teacher of

  get yourStudents() {
    let yourSections = this.args.currentUser.get('sections');
    let yourTeacherSections = yourSections.filterBy('role', 'teacher');
    let yourSectionIds = yourTeacherSections.map((section) => {
      return section.sectionId;
    });

    let studentUsers = this.args.users.filterBy('accountType', 'S');

    let studentListing = studentUsers.map((student) => {
      for (let section of student.get('sections')) {
        if (section.role === 'student') {
          if (yourSectionIds.includes(section.sectionId)) {
            return student;
          }
        }
      }
    });

    return studentListing.without(undefined);
  }

  // These are all the users that you have created - filter out duplicates

  get yourUsers() {
    let yourId = this.args.currentUser.get('id');
    let yourUsers = this.args.users.filterBy('createdBy.id', yourId);
    return yourUsers.sortBy('createDate').reverse();
  }

  // These are all the users that are in the same org as you

  get orgUsers() {
    let usersWithOrgs = this.args.users.filter((user) => {
      let accountType = user.get('accountType');
      return (
        !user.get('isTrashed') &&
        user.get('organization.id') &&
        accountType !== 'S' &&
        accountType
      );
    });
    let yourOrgId = this.args.currentUser.get('organization').get('id');
    usersWithOrgs = usersWithOrgs.filterBy('organization.id', yourOrgId);
    let orgUsersNotYou = usersWithOrgs.rejectBy(
      'username',
      this.args.currentUser.username
    );
    return orgUsersNotYou.sortBy('createDate').reverse();
  }

  @action
  toggleDeletedUsers() {
    this.showDeletedUsers = !this.showDeletedUsers;
  }
}
