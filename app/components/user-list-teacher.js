import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  elementId: 'user-list-teacher',

  // These are all the students that are in sections you are a teacher of
  yourStudents: computed('users.@each.accountType', function () {
    let yourSections = this.currentUser.get('sections');
    let yourTeacherSections = yourSections.filterBy('role', 'teacher');
    let yourSectionIds = yourTeacherSections.map((section) => {
      return section.sectionId;
    });

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
  }),

  // These are all the users that you have created - filter out duplicates
  yourUsers: computed('users.@each.isTrashed', function () {
    let yourId = this.currentUser.get('id');
    let yourUsers = this.users.filterBy('createdBy.id', yourId);
    return yourUsers.sortBy('createDate').reverse();
  }),

  // These are all the users that are in the same org as you
  orgUsers: computed('users.@each.isTrashed', function () {
    let usersWithOrgs = this.users.filter((user) => {
      let accountType = user.get('accountType');
      return (
        !user.get('isTrashed') &&
        user.get('organization.id') &&
        accountType !== 'S' &&
        accountType
      );
    });
    let yourOrgId = this.currentUser.get('organization').get('id');
    usersWithOrgs = usersWithOrgs.filterBy('organization.id', yourOrgId);
    let orgUsersNotYou = usersWithOrgs.rejectBy(
      'username',
      this.currentUser.username
    );
    return orgUsersNotYou.sortBy('createDate').reverse();
  }),
});
