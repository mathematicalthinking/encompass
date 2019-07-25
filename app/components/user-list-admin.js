Encompass.UserListAdminComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-list-admin',
  showDeletedUsers: false,

  unauthUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let unauthUsers = users.filterBy('isAuthorized', false);
    return unauthUsers.sortBy('createDate').reverse();
  }.property('users.@each.isAuthorized', 'users.@each.isTrashed'),

  adminUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let authUsers = users.filterBy('isAuthorized', true);
    let adminUsers = authUsers.filterBy('accountType', 'A');
    let adminUsersNotYou = adminUsers.rejectBy('username', this.get('currentUser.username'));
    return adminUsersNotYou.sortBy('createDate').reverse();
  }.property('users.@each.accountType', 'users.@each.isAuthorized', 'users.@each.isTrashed'),

  pdUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let authUsers = users.filterBy('isAuthorized', true);
    let students = authUsers.filterBy('accountType', 'P');
    return students.sortBy('createDate').reverse();
  }.property('users.@each.accountType', 'users.@each.isAuthorized', 'users.@each.isTrashed'),

  teacherUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let teacherUsers = users.filterBy('accountType', 'T');
    let authTeachers = teacherUsers.filterBy('isAuthorized', true);
    return authTeachers.sortBy('createDate').reverse();
  }.property('users.@each.isAuthorized', 'users.@each.accountType', 'users.@each.isTrashed'),

  studentUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let authUsers = users.filterBy('isAuthorized', true);
    let students = authUsers.filterBy('accountType', 'S');
    return students.sortBy('createDate').reverse();
  }.property('users.@each.accountType', 'users.@each.isAuthorized', 'users.@each.isTrashed'),

  trashedUsers: function () {
    return this.get('store').query('user', {
      isTrashed: true,
    });
  }.property('users.@each.isTrashed'),

  actions: {
    showDeletedUsers: function() {
      this.set('showDeletedUsers', !this.get('showDeletedUsers'));
    }
  }

});