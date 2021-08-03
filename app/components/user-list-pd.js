import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  elementId: 'user-list-pd',

  unauthUsers: computed('users.@each.isAuthorized', function () {
    let usersWithOrgs = this.users.filter((user) => {
      return !user.get('isTrashed') && user.get('organization.id');
    });
    let yourOrgId = this.currentUser.get('organization').get('id');
    usersWithOrgs = usersWithOrgs.filterBy('organization.id', yourOrgId);
    let orgUsersNotYou = usersWithOrgs.rejectBy(
      'username',
      this.currentUser.username
    );
    orgUsersNotYou = orgUsersNotYou.sortBy('createDate').reverse();
    let accountTypeUsers = orgUsersNotYou.filterBy('accountType');
    let unauthUsers = accountTypeUsers.filterBy('isAuthorized', false);
    return unauthUsers.sortBy('createDate').reverse();
  }),

  teacherUsers: computed(
    'users.@each.isAuthorized',
    'users.@each.accountType',
    function () {
      let usersWithOrgs = this.users.filter((user) => {
        let accountType = user.get('accountType');
        let isAuthorized = user.get('isAuthorized');
        return (
          !user.get('isTrashed') &&
          user.get('organization.id') &&
          accountType === 'T' &&
          accountType &&
          isAuthorized
        );
      });
      let yourOrgId = this.currentUser.get('organization').get('id');
      usersWithOrgs = usersWithOrgs.filterBy('organization.id', yourOrgId);
      let orgUsersNotYou = usersWithOrgs.rejectBy(
        'username',
        this.currentUser.username
      );
      return orgUsersNotYou.sortBy('createDate').reverse();
    }
  ),

  studentUsers: computed(
    'users.@each.accountType',
    'users.@each.isAuthorized',
    function () {
      let usersWithOrgs = this.users.filter((user) => {
        let accountType = user.get('accountType');
        let isAuthorized = user.get('isAuthorized');
        return (
          !user.get('isTrashed') &&
          user.get('organization.id') &&
          accountType === 'S' &&
          accountType &&
          isAuthorized
        );
      });
      let yourOrgId = this.currentUser.get('organization').get('id');
      usersWithOrgs = usersWithOrgs.filterBy('organization.id', yourOrgId);
      let orgUsersNotYou = usersWithOrgs.rejectBy(
        'username',
        this.currentUser.username
      );
      return orgUsersNotYou.sortBy('createDate').reverse();
    }
  ),
});
