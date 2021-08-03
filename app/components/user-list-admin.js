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
      return students.sortBy('createDate').reverse();
    }
  ),

  trashedUsers: computed('users.@each.isTrashed', function () {
    return this.store.query('user', {
      isTrashed: true,
    });
  }),

  actions: {
    showDeletedUsers: function () {
      this.set('showDeletedUsers', !this.showDeletedUsers);
    },
  },
});
