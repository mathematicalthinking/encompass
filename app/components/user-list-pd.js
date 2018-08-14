Encompass.UserListPdComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-list-pd',

  unauthUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let accountTypeUsers = users.filterBy('accountType');
    let unauthUsers = accountTypeUsers.filterBy('isAuthorized', false);
    return unauthUsers.sortBy('createDate').reverse();
  }.property('users.@each.isAuthorized'),

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


});
