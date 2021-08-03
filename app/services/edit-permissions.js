import { computed } from '@ember/object';
import { alias, equal } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  utils: service('utility-methods'),
  user: null,
  setUser(user) {
    this.set('user', user);
  },
  userId: alias('user.id'),
  userOrg: alias('user.organization'),
  accountType: alias('user.accountType'),
  actingRole: alias('user.actingRole'),
  isAdmin: equal('accountType', 'A'),
  isPdAdmin: equal('accountType', 'P'),
  isTeacher: equal('accountType', 'T'),
  isStudent: equal('accountType', 'S'),
  isPseudoStudent: equal('actingRole', 'S'),

  userOrgId: computed('user', function () {
    return this.utils.getBelongsToId(this.user, 'organization');
  }),

  isActingAdmin: computed('isPseudoStudent', 'isAdmin', function () {
    return !this.isPseudoStudent && this.isAdmin;
  }),

  isActingPdAdmin: computed('isPseudoStudent', 'isPdAdmin', function () {
    return !this.isPseudoStudent && this.isPdAdmin;
  }),

  isCreator: function (record, user = this.user) {
    if (!user || !record) {
      return;
    }
    return this.utils.getBelongsToId(record, 'createdBy') === this.userId;
  },

  doesRecordBelongToOrg(record, orgId = this.userOrgId) {
    if (!record || !orgId) {
      return;
    }
    return this.utils.getBelongsToId(record, 'organization') === orgId;
  },

  isRecordInPdDomain(record) {
    return this.isActingPdAdmin && this.doesRecordBelongToOrg(record);
  },
});
