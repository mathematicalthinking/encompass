Encompass.EditPermissionsService = Ember.Service.extend(Encompass.CurrentUserMixin, {
  utils: Ember.inject.service('utility-methods'),

  user: Ember.computed.alias('currentUser'),
  userId: Ember.computed.alias('user.id'),
  userOrg: Ember.computed.alias('user.organization'),
  accountType: Ember.computed.alias('user.accountType'),
  actingRole: Ember.computed.alias('user.actingRole'),
  isAdmin: Ember.computed.equal('accountType', 'A'),
  isPdAdmin: Ember.computed.equal('accountType', 'P'),
  isTeacher: Ember.computed.equal('accountType', 'T'),
  isStudent: Ember.computed.equal('accountType', 'S'),
  isPseudoStudent: Ember.computed.equal('actingRole', 'S'),

  userOrgId: function() {
   return this.get('utils').getBelongsToId(this.get('user'), 'organization');
  }.property('user'),

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

  doesRecordBelongToOrg(record, orgId=this.get('userOrgId')) {
    if (!record || !orgId) {
      return;
    }
    return this.get('utils').getBelongsToId(record, 'organization') === orgId;
  },

  isRecordInPdDomain(record) {
    return this.get('isActingPdAdmin') && this.doesRecordBelongToOrg(record);
  }

});
