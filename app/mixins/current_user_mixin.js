Encompass.CurrentUserMixin = Ember.Mixin.create({
  application: Ember.inject.controller(),
  utils: Ember.inject.service('utility-methods'),
  //needs: 'application',
  currentUser: Ember.computed.alias('application.currentUser'),

  newNotifications: function() {
    return this.get('currentUser.notifications').filter((ntf) => {
      return !ntf.get('isTrashed') && !ntf.get('wasSeen');
    });
  }.property('currentUser.notifications.@each.{isTrashed,wasSeen}'),

  responseNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'response');
  }.property('newNotifications.[]'),

  workspaceNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'workspace');
  }.property('newNotifications.[]'),

  assignmentNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'workspace');
  }.property('newNotifications.[]'),

  sectionNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'section');
  }.property('newNotifications.[]'),

  problemNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'problem');
  }.property('newNotifications.[]'),

  organizationNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'organization');
  }.property('newNotifications.[]'),

  userNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'user');
  }.property('newNotifications.[]'),

  newReplyNotifications: function() {
    return this.get('responseNotifications').filter((ntf) => {
      let recipientId = this.get('utils').getBelongsToId(ntf, 'recipient');
      let ntfType = ntf.get('notificationType');
      let isNewReply = ntfType === 'newMentorReply' || ntfType === 'newApproverReply';

      return isNewReply && recipientId === this.get('currentUser.id');
    });
  }.property('responseNotifications.[]'),

  findRelatedNtfs(primaryRecordType, relatedRecord, ntfType, belongsToType) {
    if (!primaryRecordType || !relatedRecord) {
      return [];
    }
    let propName = `${primaryRecordType}Notifications`;
    let baseNtfs = this.get(propName);

    if (!baseNtfs) {
      return [];
    }

    let relationshipType = belongsToType || primaryRecordType;
    return baseNtfs.filter((ntf) => {
      let belongsToId = this.get('utils').getBelongsToId(ntf, relationshipType);

      if (ntfType) {
        return ntf.get('notificationType') === ntfType && belongsToId === relatedRecord.get('id');
      }
      return belongsToId === relatedRecord.get('id');
    });
  },

});
