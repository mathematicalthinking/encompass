Encompass.UserListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-list',

  unauthUsers: function () {
    var users = this.users.filterBy('isTrashed', false);
    var unauthUsers = users.filterBy('isAuthorized', false);
    return unauthUsers;
  }.property('users.@each.isAuthorized'),

  adminUsers: function () {
    var users = this.users.filterBy('isTrashed', false);
    var adminUsers = users.filterBy('isAdmin', true);
    return adminUsers;
  }.property('users.@each.isTrashed'),

  actions: {
  }

});
