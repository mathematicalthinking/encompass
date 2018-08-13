Encompass.UserListTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-list-teacher',

  // These are all the students that are in sections you are a teacher of
  yourStudents: function () {
    let yourSections = this.get('currentUser').get('sections');

    // we want to get the id's of all the sections the teacher belongs to
    let sectionIdArray = [];
    yourSections.forEach((section) => {
      sectionIdArray.push(section.sectionId);
    });
    let section = this.store.findRecord('section', sectionIdArray[0]);

    console.log('store section', section);

    let users = this.users.filterBy('isTrashed', false);
    let students = users.filterBy('isStudent', true);
    // Then we want to get all the sections the student belongs to and if they match the teachers, return them
    return students;
  }.property('users.@each.accountType'),

//get all users, check for users that have sections the same as the one as the teacher

//can we just search the teacher's sections and return all the students in the students array

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
