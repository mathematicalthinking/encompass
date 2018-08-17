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

    // return Promise.all(yourSectionIds.map((id) => {
    //   return this.store.findRecord('section', id)
    //     .then((section) => {
    //       return section.get('students');
    //     });
    // }))
    //   .then((students) => {
    //     console.log('studnets', students);
    //   })
    //   .catch(console.log);

    let firstId = yourTeacherSections[0].sectionId;
    console.log('first sectionid is', firstId);

    let section1 = this.store.findRecord('section', firstId)
      .then((section) => {
        console.log('section is', section);
        let sectionStudents = section.get('students');
        sectionStudents.forEach((student) => {
          console.log('student name is', student.get('username'));
        });
        console.log('section students', sectionStudents);
      });
    // console.log('section 1 is', section1);
    // let section1Students = section1.get('name');
    // console.log('section1 name is', section1Students);

    let users = this.users.filterBy('isTrashed', false);
    let students = users.filterBy('isStudent', true);
    return students.sortBy('createDate').reverse();
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

  actions: {
    consoleInfo: function () {
      let yourSections = this.get('currentUser').get('sections');
      console.log('your sections', yourSections);
      let sectionIdArray = [];
      yourSections.forEach((section) => {
        sectionIdArray.push(section.sectionId);
      });
      console.log('your sections ids are', sectionIdArray);
    }
  }

});
