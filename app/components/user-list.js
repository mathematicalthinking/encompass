import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  elementId: 'user-list-admin',
  showDeletedUsers: false,

  unauthUsers: computed(
    'users.@each.isAuthorized',
    'users.@each.isTrashed',
    function () {
      let users = this.users.filterBy('isTrashed', false);
      let unauthUsers = users.filterBy('isAuthorized', false);
      if (this.currentUser.isPdAdmin) {
        let orgUsersNotYou = unauthUsers
          .filterBy('organization.id', this.currentUser.get('organization.id'))
          .rejectBy('username', this.currentUser.user);
        return orgUsersNotYou.sortBy('createDate').reverse();
      }
      return unauthUsers.sortBy('createDate').reverse();
    }
  ),

  adminUsers: computed(
    'users.@each.accountType',
    'users.@each.isAuthorized',
    'users.@each.isTrashed',
    function () {
      let users = this.users.filterBy('isTrashed', false);
      let authUsers = users.filterBy('isAuthorized', true);
      let adminUsers = authUsers.filterBy('accountType', 'A');
      let adminUsersNotYou = adminUsers.rejectBy(
        'username',
        this.currentUser.username
      );
      return adminUsersNotYou.sortBy('createDate').reverse();
    }
  ),

  pdUsers: computed(
    'users.@each.accountType',
    'users.@each.isAuthorized',
    'users.@each.isTrashed',
    function () {
      let users = this.users.filterBy('isTrashed', false);
      let authUsers = users.filterBy('isAuthorized', true);
      let students = authUsers.filterBy('accountType', 'P');
      return students.sortBy('createDate').reverse();
    }
  ),

  teacherUsers: computed(
    'users.@each.isAuthorized',
    'users.@each.accountType',
    'users.@each.isTrashed',
    function () {
      let users = this.users.filterBy('isTrashed', false);
      let teacherUsers = users.filterBy('accountType', 'T');
      let authTeachers = teacherUsers.filterBy('isAuthorized', true);
      if (this.currentUser.isPdAdmin) {
        let orgUsersNotYou = authTeachers
          .filterBy('organization.id', this.currentUser.get('organization.id'))
          .rejectBy('username', this.currentUser.username);
        return orgUsersNotYou.sortBy('createDate').reverse();
      }
      return authTeachers.sortBy('createDate').reverse();
    }
  ),

  studentUsers: computed(
    'users.@each.accountType',
    'users.@each.isAuthorized',
    'users.@each.isTrashed',
    function () {
      let users = this.users.filterBy('isTrashed', false);
      let authUsers = users.filterBy('isAuthorized', true);
      let students = authUsers.filterBy('accountType', 'S');
      if (this.currentUser.isPdAdmin) {
        let orgUsersNotYou = students
          .filterBy('organization.id', this.currentUser.get('organization.id'))
          .rejectBy('username', this.currentUser.username);
        return orgUsersNotYou.sortBy('createDate').reverse();
      }
      return students.sortBy('createDate').reverse();
    }
  ),

  trashedUsers: computed('users.@each.isTrashed', function () {
    return this.store.query('user', {
      isTrashed: true,
    });
  }),
  // These are all the students that are in sections you are a teacher of
  yourStudents: computed('users.@each.accountType', function () {
    let yourSections = this.currentUser.get('sections');
    let yourTeacherSections = yourSections.filterBy('role', 'teacher');
    let yourSectionIds = yourTeacherSections.map((section) => {
      return section.sectionId;
    });

    let studentUsers = this.users.filterBy('accountType', 'S');

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
  }),

  // These are all the users that you have created - filter out duplicates
  yourUsers: computed('users.@each.isTrashed', function () {
    let yourId = this.currentUser.get('id');
    let yourUsers = this.users.filterBy('createdBy.id', yourId);
    return yourUsers.sortBy('createDate').reverse();
  }),

  // These are all the users that are in the same org as you
  orgUsers: computed('users.@each.isTrashed', function () {
    let usersWithOrgs = this.users.filter((user) => {
      let accountType = user.get('accountType');
      return (
        !user.get('isTrashed') &&
        user.get('organization.id') &&
        accountType !== 'S' &&
        accountType
      );
    });
    let yourOrgId = this.currentUser.get('organization').get('id');
    usersWithOrgs = usersWithOrgs.filterBy('organization.id', yourOrgId);
    let orgUsersNotYou = usersWithOrgs.rejectBy(
      'username',
      this.get('currentUser.username')
    );
    return orgUsersNotYou.sortBy('createDate').reverse();
  }),

  actions: {
    showDeletedUsers: function () {
      this.set('showDeletedUsers', !this.showDeletedUsers);
    },
  },
});
