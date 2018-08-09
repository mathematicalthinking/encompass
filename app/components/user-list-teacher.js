Encompass.UserListTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-list-teacher',

  orgUsers: function () {
    let users = this.users.filterBy('isTrashed', false);
    let usersWithOrgs = this.users.filter((user) => {
      return !user.get('isTrashed') && user.get('organization.id') && !user.get('isStudent');
    });
    let yourOrgId = this.get('currentUser').get('organization').get('id');
    //console.log('your Org is', yourOrg);

    return usersWithOrgs.filterBy('organization.id', yourOrgId);
  }.property('users.@each.isTrashed'),

  // adminUsers: function () {
  //   let users = this.users.filterBy('isTrashed', false);
  //   let adminUsers = users.filterBy('isAdmin', true);
  //   return adminUsers;
  // }.property('users.@each.isAdmin'),

  // studentUsers: function () {
  //   let users = this.users.filterBy('isTrashed', false);
  //   let students = users.filterBy('isStudent', true);
  //   return students;
  // }.property('users.@each.isStudent'),

  // authUsers: function () {
  //   let users = this.users.filterBy('isTrashed', false);
  //   let authUsers = users.filterBy('isAuthorized', true);
  //   let notStudent = authUsers.filter((user) => {
  //     let student = user.get('isStudent');
  //     return student !== true;
  //   });
  //   let notAdmin = notStudent.filter((user) => {
  //     let admin = user.get('isAdmin');
  //     return admin !== true;
  //   });
  //   return notAdmin;
  // }.property('users.@each.isAuthorized'),

  actions: {}

});
