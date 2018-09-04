Encompass.UserListTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-list-teacher',

  // Get all the teacher's sections where they are role student. Then get all the students inside the teacher's sections

  // These are all the students that are in sections you are a teacher of
  yourStudents: function () {
    let yourSections = this.get('currentUser').get('sections');
    let yourTeacherSections = yourSections.filterBy('role', 'teacher');
    console.log('yourTeacher Sections is', yourTeacherSections);
    let yourSectionIds = [];
    yourTeacherSections.forEach((section) => {
      yourSectionIds.push(section.sectionId);
    });
    console.log('your sections ids', yourSectionIds);

    let firstId = yourTeacherSections[0].sectionId;
    console.log('first sectionid is', firstId);

    let studentListing = [];
    return this.store.findRecord('section', firstId)
      .then((section) => {
        let sectionStudents = section.get('students');
        sectionStudents.forEach((student) => {
          console.log('student name is', student.get('username'));
          studentListing.push(student);
        });
        console.log('studentListing is', studentListing);
      });


    // return studentListing.sortBy('createDate').reverse();
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
