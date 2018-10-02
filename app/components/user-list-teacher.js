Encompass.UserListTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-list-teacher',

  // These are all the students that are in sections you are a teacher of
  yourStudents: function () {
    let yourSections = this.get('currentUser').get('sections');
    let yourTeacherSections = yourSections.filterBy('role', 'teacher');
    let yourSectionIds = yourTeacherSections.map(section => { return section.sectionId; });

    let studentUsers = this.users.filterBy('accountType', 'S');

    let studentListing = studentUsers.map((student) => {
      for (let section of student.get('sections')) {
        if (section.role === 'student') {
          if (yourSectionIds.includes(section.sectionId)) {
            return student;
          }
        }
      }
    });

    return studentListing.without(undefined);

  }.property('users.@each.accountType'),

  // These are all the users that you have created - filter out duplicates
  yourUsers: function () {
    let yourId = this.get('currentUser').get('id');
    let yourUsers = this.users.filterBy('createdBy.id', yourId);
    return yourUsers.sortBy('createDate').reverse();
  }.property('users.@each.isTrashed'),

  // These are all the users that are in the same org as you
  orgUsers: function () {
    let usersWithOrgs = this.users.filter((user) => {
      let accountType = user.get('accountType');
      return !user.get('isTrashed') && user.get('organization.id') && accountType !== 'S' && accountType;
    });
    let yourOrgId = this.get('currentUser').get('organization').get('id');
    usersWithOrgs = usersWithOrgs.filterBy('organization.id', yourOrgId);
    let orgUsersNotYou = usersWithOrgs.rejectBy('username', this.get('currentUser.username'));
    return orgUsersNotYou.sortBy('createDate').reverse();
  }.property('users.@each.isTrashed'),


});
