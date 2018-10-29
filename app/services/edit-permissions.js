Encompass.EditPermissionsService = Ember.Service.extend(Encompass.CurrentUserMixin, {
  user: Ember.computed.alias('currentUser'),
  userId: Ember.computed.alias('user.id'),
  userOrg: Ember.computed.alias('user.organization'),
  userOrgId: Ember.computed.alias('userOrg.id'),
  accountType: Ember.computed.alias('user.accountType'),
  actingRole: Ember.computed.alias('user.actingRole'),
  isAdmin: Ember.computed.equal('accountType', 'A'),
  isPdAdmin: Ember.computed.equal('accountType', 'P'),
  isTeacher: Ember.computed.equal('accountType', 'T'),
  isStudent: Ember.computed.equal('accountType', 'S'),
  isPseudoStudent: Ember.computed.equal('actingRole', 'S'),



  isCreator: function(record, user=this.get('user')) {
    if (!user || !record) {
      return;
    }
    return record.get('createdBy.id') === this.get('userId');
  },

  doesRecordBelongToOrg: function(record, org=this.get('userOrg')) {
    if (!record || !org) {
      return;
    }
    return record.get('organization.id') === this.get('userOrgId');
  }

});
