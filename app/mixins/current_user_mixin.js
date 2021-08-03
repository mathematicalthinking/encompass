import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  utils: service('utility-methods'),
  userNtfs: service('user-ntfs'),
  //needs: 'application',
  currentUser: alias('application.currentUser'),

  areNtfsLoaded: alias('userNtfs.areNtfsLoaded'),

  newNotifications: computed(
    'userNtfs.newNotifications.[]',
    'areNtfsLoaded',
    function () {
      if (this.areNtfsLoaded) {
        return this.userNtfs.newNotifications;
      }
      return [];
    }
  ),

  responseNotifications: computed.filterBy(
    'newNotifications',
    'primaryRecordType',
    'response'
  ),

  newReplyNotifications: computed(
    'currentUser.id',
    'responseNotifications.[]',
    function () {
      return this.responseNotifications.filter((ntf) => {
        let recipientId = this.utils.getBelongsToId(ntf, 'recipient');
        let ntfType = ntf.get('notificationType');
        let isNewReply =
          ntfType === 'newMentorReply' || ntfType === 'newApproverReply';

        return isNewReply && recipientId === this.currentUser.id;
      });
    }
  ),

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
