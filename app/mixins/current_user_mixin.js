import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  utils: service('utility-methods'),
  userNtfs: service('user-ntfs'),

  areNtfsLoaded: alias('userNtfs.areNtfsLoaded'),

  newNotifications: computed(
    'userNtfs.newNotifications.[]',
    'areNtfsLoaded',
    function () {
      if (this.areNtfsLoaded) {
        return this.get('userNtfs.newNotifications');
      }
      return [];
    }
  ),

  responseNotifications: computed('newNotifications.[]', function () {
    return this.newNotifications.filterBy('primaryRecordType', 'response');
  }),

  workspaceNotifications: computed('newNotifications.[]', function () {
    return this.newNotifications.filterBy('primaryRecordType', 'workspace');
  }),

  assignmentNotifications: computed('newNotifications.[]', function () {
    return this.newNotifications.filterBy('primaryRecordType', 'workspace');
  }),

  sectionNotifications: computed('newNotifications.[]', function () {
    return this.newNotifications.filterBy('primaryRecordType', 'section');
  }),

  problemNotifications: computed('newNotifications.[]', function () {
    return this.newNotifications.filterBy('primaryRecordType', 'problem');
  }),

  organizationNotifications: computed('newNotifications.[]', function () {
    return this.newNotifications.filterBy('primaryRecordType', 'organization');
  }),

  userNotifications: computed('newNotifications.[]', function () {
    return this.newNotifications.filterBy('primaryRecordType', 'user');
  }),

  newReplyNotifications: computed('responseNotifications.[]', function () {
    return this.responseNotifications.filter((ntf) => {
      let recipientId = this.utils.getBelongsToId(ntf, 'recipient');
      let ntfType = ntf.get('notificationType');
      let isNewReply =
        ntfType === 'newMentorReply' || ntfType === 'newApproverReply';

      return isNewReply && recipientId === this.get('currentUser.id');
    });
  }),

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
      let belongsToId = this.utils.getBelongsToId(ntf, relationshipType);

      if (ntfType) {
        return (
          ntf.get('notificationType') === ntfType &&
          belongsToId === relatedRecord.get('id')
        );
      }
      return belongsToId === relatedRecord.get('id');
    });
  },
});
