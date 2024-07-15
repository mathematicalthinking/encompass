import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class NotificationService extends Service {
  @service('utility-methods') utils;
  @service userNtfs;
  @service currentUser;

  @tracked newNotifications = [];

  constructor() {
    super(...arguments);
    this.updateNotifications();
  }

  updateNotifications() {
    if (this.areNtfsLoaded) {
      this.newNotifications = this.userNtfs.newNotifications;
    }
  }

  get areNtfsLoaded() {
    return this.userNtfs.areNtfsLoaded;
  }

  get responseNotifications() {
    return this.newNotifications.filter(
      (ntf) => ntf.primaryRecordType === 'response'
    );
  }

  get workspaceNotifications() {
    return this.newNotifications.filter(
      (ntf) => ntf.primaryRecordType === 'workspace'
    );
  }

  get assignmentNotifications() {
    return this.newNotifications.filter(
      (ntf) => ntf.primaryRecordType === 'workspace'
    );
  }

  get sectionNotifications() {
    return this.newNotifications.filter(
      (ntf) => ntf.primaryRecordType === 'section'
    );
  }

  get problemNotifications() {
    return this.newNotifications.filter(
      (ntf) => ntf.primaryRecordType === 'problem'
    );
  }

  get organizationNotifications() {
    return this.newNotifications.filter(
      (ntf) => ntf.primaryRecordType === 'organization'
    );
  }

  get userNotifications() {
    return this.newNotifications.filter(
      (ntf) => ntf.primaryRecordType === 'user'
    );
  }

  get newReplyNotifications() {
    return this.responseNotifications.filter((ntf) => {
      let recipientId = this.utils.getBelongsToId(ntf, 'recipient');
      let ntfType = ntf.notificationType;
      let isNewReply =
        ntfType === 'newMentorReply' || ntfType === 'newApproverReply';

      return isNewReply && recipientId === this.currentUser.id;
    });
  }

  findRelatedNtfs(primaryRecordType, relatedRecord, ntfType, belongsToType) {
    if (!primaryRecordType || !relatedRecord) {
      return [];
    }
    let propName = `${primaryRecordType}Notifications`;
    let baseNtfs = this[propName];

    if (!baseNtfs) {
      return [];
    }

    let relationshipType = belongsToType || primaryRecordType;
    return baseNtfs.filter((ntf) => {
      let belongsToId = this.utils.getBelongsToId(ntf, relationshipType);

      if (ntfType) {
        return (
          ntf.notificationType === ntfType && belongsToId === relatedRecord.id
        );
      }
      return belongsToId === relatedRecord.id;
    });
  }
}
