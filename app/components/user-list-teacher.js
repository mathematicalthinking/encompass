Encompass.UserListTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-list-teacher',

  // These are all the students that are in sections you are a teacher of
  yourStudents: function () {
    // let users = this.users.filterBy('isTrashed', false);
    // let adminUsers = users.filterBy('isAdmin', true);
    // return adminUsers;
  }.property('users.@each.isTrashed'),

  // These are all the users that you have created - filter out duplicates
  yourUsers: function () {
    let yourId = this.get('currentUser').get('id');
    let yourUsers = this.users.filterBy('createdBy.id', yourId);
    return yourUsers;
  }.property('users.@each.isTrashed'),

  // These are all the users that are in the same org as you
  orgUsers: function () {
    let usersWithOrgs = this.users.filter((user) => {
      return !user.get('isTrashed') && user.get('organization.id') && !user.get('isStudent');
    });
    let yourOrgId = this.get('currentUser').get('organization').get('id');
    return usersWithOrgs.filterBy('organization.id', yourOrgId);
  }.property('users.@each.isTrashed'),

  actions: {}

});
