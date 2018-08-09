Encompass.UserListTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-list-teacher',

  yourStudents: function () {
    let users = this.users.filterBy('isTrashed', false);
    let adminUsers = users.filterBy('isAdmin', true);
    return adminUsers;
  }.property('users.@each.isTrashed'),

  yourUsers: function () {
    let yourId = this.get('currentUser').get('id');
    console.log('yourId', yourId);
    let yourUsers = this.users.filterBy('createdBy.id', yourId);
    return yourUsers;
  }.property('users.@each.isTrashed'),

  orgUsers: function () {
    let usersWithOrgs = this.users.filter((user) => {
      return !user.get('isTrashed') && user.get('organization.id') && !user.get('isStudent');
    });
    let yourOrgId = this.get('currentUser').get('organization').get('id');
    return usersWithOrgs.filterBy('organization.id', yourOrgId);
  }.property('users.@each.isTrashed'),

  actions: {}

});
