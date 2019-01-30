Encompass.EditPermissionsService = Ember.Service.extend(Encompass.CurrentUserMixin, {
  utils: Ember.inject.service('utility-methods'),

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

  isActingAdmin: function() {
    return !this.get('isPseudoStudent') && this.get('isAdmin');
  }.property('isPseudoStudent', 'isAdmin'),

  isActingPdAdmin: function() {
    return !this.get('isPseudoStudent') && this.get('isPdAdmin');
  }.property('isPseudoStudent', 'isPdAdmin'),

  isCreator: function(record, user=this.get('user')) {
    if (!user || !record) {
      return;
    }
    return this.get('utils').getBelongsToId(record, 'createdBy') === this.get('userId');
  },

  doesRecordBelongToOrg(record, org=this.get('userOrg')) {
    if (!record || !org) {
      return;
    }
    return this.get('utils').getBelongsToId(record, 'organization') === this.get('userOrgId');
  },

  isRecordInPdDomain(record) {
    return this.get('isActingPdAdmin') && this.doesRecordBelongToOrg(record);
  }

});
