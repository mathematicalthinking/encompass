Encompass.UserListAdminComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-list-admin',

  // init: function () {
  //   this.get('users');
  // },

  unauthUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let unauthUsers = users.filterBy('isAuthorized', false);
    return unauthUsers.sortBy('createDate').reverse();
  }.property('users.@each.isAuthorized'),

  adminUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let adminUsers = users.filterBy('accountType', 'A');
    return adminUsers.sortBy('createDate').reverse();
  }.property('users.@each.accountType'),

  studentUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let students = users.filterBy('accountType', 'S');
    return students.sortBy('createDate').reverse();
  }.property('users.@each.accountType'),

  teacherUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let teacherUsers = users.filterBy('accountType', 'T');
    return teacherUsers.sortBy('createDate').reverse();
  }.property('users.@each.accountType'),

  actions: {}

});
