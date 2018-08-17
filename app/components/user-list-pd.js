Encompass.UserListPdComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-list-pd',

  unauthUsers: function () {
    let usersWithOrgs = this.users.filter((user) => {
      return !user.get('isTrashed') && user.get('organization.id');
    });
    let yourOrgId = this.get('currentUser').get('organization').get('id');
    usersWithOrgs = usersWithOrgs.filterBy('organization.id', yourOrgId);
    let orgUsersNotYou = usersWithOrgs.rejectBy('username', this.get('currentUser.username'));
    orgUsersNotYou = orgUsersNotYou.sortBy('createDate').reverse();
    let accountTypeUsers = orgUsersNotYou.filterBy('accountType');
    let unauthUsers = accountTypeUsers.filterBy('isAuthorized', false);
    return unauthUsers.sortBy('createDate').reverse();
  }.property('users.@each.isAuthorized'),

  teacherUsers: function () {
    let usersWithOrgs = this.users.filter((user) => {
      let accountType = user.get('accountType');
      let isAuthorized = user.get('isAuthorized');
      return !user.get('isTrashed') && user.get('organization.id') && accountType === "T" && accountType && isAuthorized;
    });
    let yourOrgId = this.get('currentUser').get('organization').get('id');
    usersWithOrgs = usersWithOrgs.filterBy('organization.id', yourOrgId);
    let orgUsersNotYou = usersWithOrgs.rejectBy('username', this.get('currentUser.username'));
    return orgUsersNotYou.sortBy('createDate').reverse();
  }.property('users.@each.isAuthorized', 'users.@each.accountType'),

  studentUsers: function () {
    let usersWithOrgs = this.users.filter((user) => {
      let accountType = user.get('accountType');
      let isAuthorized = user.get('isAuthorized');
      return !user.get('isTrashed') && user.get('organization.id') && accountType === "S" && accountType && isAuthorized;
    });
    let yourOrgId = this.get('currentUser').get('organization').get('id');
    usersWithOrgs = usersWithOrgs.filterBy('organization.id', yourOrgId);
    let orgUsersNotYou = usersWithOrgs.rejectBy('username', this.get('currentUser.username'));
    return orgUsersNotYou.sortBy('createDate').reverse();
  }.property('users.@each.accountType', 'users.@each.isAuthorized'),


});