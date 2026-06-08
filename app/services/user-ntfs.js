import Service, { service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';

export default class UserNtfsService extends Service {
  @service store;
  @service('utility-methods') utils;

  @tracked user = null;
  @tracked responses = [];
  @tracked notifications = [];
  @tracked areNtfsLoaded = false;

  async setupProperties(user) {
    this.user = user;
    this.responses = this.store.peekAll('response');
    this.notifications = await user.notifications;
    this.areNtfsLoaded = true;
  }

  doesArrayContainObjectById(records, id) {
    if (!records || !id) {
      return false;
    }

    return records.some((record) => record.id === id);
  }

  clearNotificationsForResponses(notifications, responses) {
    notifications.forEach((notification) => {
      const responseId = this.utils.getBelongsToId(notification, 'response');

      if (this.doesArrayContainObjectById(responses, responseId)) {
        notification.isTrashed = true;
        notification.wasSeen = true;
        notification.save();
      }
    });
  }

  @cached
  get trashedResponses() {
    const responses = this.responses.filter((response) => response.isTrashed);
    this.clearNotificationsForResponses(this.responseNotifications, responses);
    return responses;
  }

  get nonTrashedResponses() {
    return this.responses.filter((response) => !response.isTrashed);
  }

  get mentorResponses() {
    return this.nonTrashedResponses.filter(
      (response) => response.responseType === 'mentor'
    );
  }

  @cached
  get supercededReponses() {
    const responses = this.nonTrashedResponses.filter(
      (response) => response.status === 'superceded'
    );
    this.clearNotificationsForResponses(this.responseNotifications, responses);
    return responses;
  }

  @cached
  get readByRecipientResponses() {
    const responses = this.nonTrashedResponses.filter(
      (response) => response.wasReadByRecipient
    );
    this.clearNotificationsForResponses(this.newReplyNotifications, responses);
    return responses;
  }

  @cached
  get approvedMentorReponses() {
    const responses = this.mentorResponses.filter(
      (response) => response.status === 'approved'
    );
    this.clearNotificationsForResponses(
      this.requiresApprovalNotifications,
      responses
    );
    return responses;
  }

  get responseNotifications() {
    return this.notifications.filter(
      (notification) => notification.primaryRecordType === 'response'
    );
  }

  findRelatedNtfs(
    primaryRecordType,
    relatedRecord,
    notificationType,
    belongsToType,
    propertyName
  ) {
    if (!primaryRecordType || !relatedRecord) {
      return [];
    }

    const resolvedPropertyName =
      propertyName || `${primaryRecordType}Notifications`;
    const notifications = this[resolvedPropertyName];

    if (!notifications) {
      return [];
    }

    const relationshipType = belongsToType || primaryRecordType;
    return notifications.filter((notification) => {
      const belongsToId = this.utils.getBelongsToId(
        notification,
        relationshipType
      );

      if (notificationType) {
        return (
          notification.notificationType === notificationType &&
          belongsToId === relatedRecord.id
        );
      }
      return belongsToId === relatedRecord.id;
    });
  }

  get newNotifications() {
    return this.notifications.filter((notification) => {
      return !notification.wasSeen && !notification.isTrashed;
    });
  }

  get newReplyNotifications() {
    return this.responseNotifications.filter((notification) => {
      const notificationType = notification.notificationType;
      return (
        notificationType === 'newMentorReply' ||
        notificationType === 'newApproverReply' ||
        notificationType === 'newlyApprovedReply'
      );
    });
  }

  get requiresApprovalNotifications() {
    return this.responseNotifications.filter(
      (notification) =>
        notification.notificationType === 'mentorReplyRequiresApproval'
    );
  }

  get needsRevisionNotifications() {
    return this.responseNotifications.filter(
      (notification) =>
        notification.notificationType === 'mentorReplyNeedsRevisions'
    );
  }

  @cached
  get updatedResponseNotifications() {
    return Promise.all(
      this.responseNotifications.map(async (notification) => {
        if (notification.notificationType === 'newWorkToMentor') {
          return notification;
        }

        const responseId = this.utils.getBelongsToId(notification, 'response');
        if (!responseId) {
          notification.wasSeen = true;
          return notification.save();
        }

        const response = await notification.response;

        if (response.isTrashed || response.status === 'superceded') {
          notification.wasSeen = true;
          return notification.save();
        }

        return undefined;
      })
    );
  }
}
