Encompass.UserListAdminComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-list-admin',

  // init: function () {
  //   this.get('users');
  // },

  unauthUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let accountTypeUsers = users.filterBy('accountType');
    let unauthUsers = accountTypeUsers.filterBy('isAuthorized', false);
    return unauthUsers.sortBy('createDate').reverse();
  }.property('users.@each.isAuthorized'),

  adminUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let authUsers = users.filterBy('isAuthorized', true);
    let adminUsers = authUsers.filterBy('accountType', 'A');
    return adminUsers.sortBy('createDate').reverse();
  }.property('users.@each.accountType', 'users.@each.isAuthorized'),

  pdUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let authUsers = users.filterBy('isAuthorized', true);
    let students = authUsers.filterBy('accountType', 'P');
    return students.sortBy('createDate').reverse();
  }.property('users.@each.accountType', 'users.@each.isAuthorized'),

  teacherUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let teacherUsers = users.filterBy('accountType', 'T');
    let authTeachers = teacherUsers.filterBy('isAuthorized', true);
    return authTeachers.sortBy('createDate').reverse();
  }.property('users.@each.isAuthorized', 'users.@each.accountType'),

  studentUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let authUsers = users.filterBy('isAuthorized', true);
    let students = authUsers.filterBy('accountType', 'S');
    return students.sortBy('createDate').reverse();
  }.property('users.@each.accountType', 'users.@each.isAuthorized'),


  actions: {}

});
