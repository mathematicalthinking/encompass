//used throughout app, especially top-bar.hbs?
Encompass.CurrentUserMixin = Ember.Mixin.create({
  application: Ember.inject.controller(),
  utils: Ember.inject.service('utility-methods'),
  userNtfs: Ember.inject.service('user-ntfs'),
  //needs: 'application',
  currentUser: Ember.computed.alias('application.currentUser'),

  areNtfsLoaded: Ember.computed.alias('userNtfs.areNtfsLoaded'),

  //used throughout mixin, app/models/response_thread.js, app/services/user-ntfs.js
  newNotifications: function() {
    if (this.get('areNtfsLoaded')) {
      return this.get('userNtfs.newNotifications');
    }
    return [];
  }.property('userNtfs.newNotifications.[]', 'areNtfsLoaded'),

  responseNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'response');
  }.property('newNotifications.[]'),

  //only used here
  workspaceNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'workspace');
  }.property('newNotifications.[]'),

  assignmentNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'workspace');
  }.property('newNotifications.[]'),

  sectionNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'section');
  }.property('newNotifications.[]'),
  //only used here
  problemNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'problem');
  }.property('newNotifications.[]'),
  //only used here
  organizationNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'organization');
  }.property('newNotifications.[]'),
//only used here
  userNotifications: function() {
    return this.get('newNotifications').filterBy('primaryRecordType', 'user');
  }.property('newNotifications.[]'),
//app/services/user-ntfs.js
  newReplyNotifications: function() {
    return this.get('responseNotifications').filter((ntf) => {
      let recipientId = this.get('utils').getBelongsToId(ntf, 'recipient');
      let ntfType = ntf.get('notificationType');
      let isNewReply = ntfType === 'newMentorReply' || ntfType === 'newApproverReply';

      return isNewReply && recipientId === this.get('currentUser.id');
    });
  }.property('responseNotifications.[]'),

  // used in app/components/response-container.js and app/services/user-ntfs.js
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
