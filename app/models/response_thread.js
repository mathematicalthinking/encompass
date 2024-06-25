// app/models/thread.js

import Model, { attr, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { gt } from '@ember/object/computed';

export default class ResponseThread extends Model {
  @service utils;
  @service store;
  @service currentUser;
  @service notificationService;
  @attr('string') workspaceName;
  @attr('string') problemTitle;
  @attr() uniqueIdentifier;
  @attr('string') threadType; // submitter, mentor, approver
  @attr('string') studentDisplay;

  @hasMany('submission') submissions;
  @hasMany('response') responses;
  @hasMany('user') mentors;

  @attr('boolean', { defaultValue: false }) isNewThread;

  @gt('newRevisions.length', 0) hasNewRevision;
  @gt('needsRevisionResponses.length', 0) inNeedOfRevisions;
  @gt('pendingApprovalResponses.length', 0) isWaitingForApproval;
  @gt('draftResponses.length', 0) hasDraft;
  @gt('unreadResponses.length', 0) hasUnreadReply;
  @gt('unmentoredRevisions.length', 0) hasUnmentoredRevisions;
  @gt('newlyApprovedReplies.length', 0) hasNewlyApprovedReply;

  get mentorDisplay() {
    return `${this.mentors.firstObject.username}${
      this.mentors.length > 1 ? ', etc.' : ''
    }`;
  }

  @computed('newNotifications.[]', 'cleanResponses.[]', 'sortedRevisions.[]')
  get relatedNewNtfs() {
    return this.notificationService.newNotifications.filter((ntf) => {
      if (ntf.primaryRecordType !== 'response') {
        return false;
      }
      const responseId = this.utils.getBelongsToId(ntf, 'response');
      const subId = this.utils.getBelongsToId(ntf, 'submission');

      const foundResponse = this.cleanResponses.find((response) => {
        return response.id === responseId;
      });

      if (foundResponse) {
        return true;
      }
      return this.sortedRevisions.find((sub) => {
        return sub.id === subId;
      });
    });
  }

  @computed('relatedNewNtfs.[]')
  get newNtfCount() {
    return this.relatedNewNtfs.length;
  }

  @computed(
    'threadType',
    'hasDraft',
    'hasUnreadReply',
    'hasUnmentoredRevisions',
    'hasNewlyApprovedReply',
    'hasNewRevision',
    'isWaitingForApproval',
    'inNeedOfRevisions'
  )
  get sortPriority() {
    const { threadType } = this;
    if (threadType === 'submitter') {
      return this.getSubmitterPriority();
    }
    if (threadType === 'mentor') {
      return this.getMentoringPriority();
    }
    if (threadType === 'approver') {
      return this.getApprovingPriority();
    }
    return 0;
  }

  getApprovingPriority() {
    let sum = 0;
    if (this.hasDraft) {
      sum += 100;
    }
    if (this.isWaitingForApproval) {
      sum += 50;
    }
    if (this.hasUnreadReply) {
      sum += 10;
    }
    if (this.inNeedOfRevisions) {
      sum += 1;
    }
    return sum;
  }

  getSubmitterPriority() {
    let sum = 0;
    if (this.hasUnreadReply) {
      sum += 10;
    }
    return sum;
  }

  getMentoringPriority() {
    let sum = 0;
    if (this.hasDraft) {
      sum += 500;
    }
    if (this.inNeedOfRevisions) {
      sum += 300;
    }
    if (this.hasNewRevision) {
      sum += 100;
    }
    if (this.hasUnmentoredRevisions) {
      sum += 25;
    }
    if (this.hasUnreadReply) {
      sum += 10;
    }
    if (this.hasNewlyApprovedReply) {
      sum += 5;
    }
    if (this.isWaitingForApproval) {
      sum += 1;
    }
    return sum;
  }

  @computed(
    'hasUnreadReply',
    'hasDraft',
    'isWaitingForApproval',
    'inNeedOfRevisions',
    'hasNewRevision',
    'threadType'
  )
  get isActionNeeded() {
    const { threadType } = this;
    if (this.hasUnreadReply || this.hasDraft) {
      return true;
    }
    if (threadType === 'mentor') {
      return this.inNeedOfRevisions || this.hasNewRevision;
    }
    if (threadType === 'approver') {
      return this.isWaitingForApproval;
    }
    return true;
  }

  @computed('responses.@each.isTrashed')
  get cleanResponses() {
    return this.responses.rejectBy('isTrashed').sortBy('createDate');
  }

  get unreadResponses() {
    return this.cleanResponses.filter((response) => {
      const recipientId = this.utils.getBelongsToId(response, 'recipient');
      return (
        !response.wasReadByRecipient && recipientId === this.currentUser.user.id
      );
    });
  }

  @computed('cleanResponses.@each.status')
  get draftResponses() {
    return this.cleanResponses.filterBy('status', 'draft');
  }

  @computed('cleanResponses.@each.status')
  get needsRevisionResponses() {
    return this.cleanResponses.filterBy('status', 'needsRevisions');
  }

  @computed('cleanResponses.@each.status')
  get pendingApprovalResponses() {
    return this.cleanResponses.filterBy('status', 'pendingApproval');
  }

  @computed('cleanResponses.[]')
  get latestReply() {
    return this.cleanResponses.lastObject;
  }

  @computed('submissions.content.[]')
  get sortedRevisions() {
    return this.submissions.content.sortBy('createDate');
  }

  @computed('newNotifications.[]', 'sortedRevisions.[]')
  get newRevisions() {
    const newWorkNtfs = this.notificationService.newNotifications.filterBy(
      'notificationType',
      'newWorkToMentor'
    );
    const newSubIds = newWorkNtfs
      .map((ntf) => {
        return this.utils.getBelongsToId(ntf, 'submission');
      })
      .compact()
      .uniq();
    return this.sortedRevisions.filter((sub) => {
      return newSubIds.includes(sub.id);
    });
  }

  get yourMentorReplies() {
    return this.cleanResponses.filter((response) => {
      const creatorId = this.utils.getBelongsToId(response, 'createdBy');
      return (
        response.responseType === 'mentor' && creatorId === this.currentUser.id
      );
    });
  }

  @computed('newNotifications.@each.notificationType', 'cleanResponses.[]')
  get newlyApprovedReplies() {
    const newlyApprovedNtfs =
      this.notificationService.newNotifications.filterBy(
        'notificationType',
        'newlyApprovedReply'
      );
    const newResponseIds = newlyApprovedNtfs
      .map((ntf) => {
        return this.utils.getBelongsToId(ntf, 'response');
      })
      .compact()
      .uniq();
    return this.cleanResponses
      .filter((response) => {
        const existingId = response.id;
        return newResponseIds.includes(existingId);
      })
      .compact();
  }

  @computed(
    'yourMentorReplies.[]',
    'sortedRevisions.@each.createDate',
    'threadType',
    'yourLatestMentorReply.createDate'
  )
  get unmentoredRevisions() {
    if (this.threadType !== 'mentor') {
      return [];
    }
    const mentoredRevisionIds = this.yourMentorReplies
      .map((response) => {
        return this.utils.getBelongsToId(response, 'submission');
      })
      .compact()
      .uniq();

    const latestReplyDate = this.yourLatestMentorReply.createDate;

    return this.sortedRevisions.filter((submission) => {
      return (
        !mentoredRevisionIds.includes(submission.id) &&
        submission.createDate > latestReplyDate
      );
    });
  }

  @computed('sortedRevisions.[]')
  get latestRevision() {
    return this.sortedRevisions.lastObject;
  }

  @computed(
    'hasDraft',
    'hasUnreadReply',
    'isWaitingForApproval',
    'hasNewRevision',
    'hasUnmentoredRevisions',
    'inNeedOfRevisions',
    'hasNewlyApprovedReply'
  )
  get highestPriorityStatus() {
    if (this.hasDraft) {
      return 'hasDraft';
    }
    if (this.hasNewRevision) {
      return 'hasNewRevision';
    }
    if (this.hasUnmentoredRevisions) {
      return 'hasUnmentoredRevisions';
    }
    if (this.hasUnreadReply) {
      return 'hasUnreadReply';
    }
    if (this.isWaitingForApproval) {
      return 'isWaitingForApproval';
    }
    if (this.inNeedOfRevisions) {
      return 'inNeedOfRevisions';
    }
    if (this.hasNewlyApprovedReply) {
      return 'hasNewlyApprovedReply';
    }
    return 'upToDate';
  }

  get highestPriorityResponse() {
    const status = this.highestPriorityStatus;

    if (status === 'hasDraft') {
      return this.draftResponses.lastObject;
    }

    if (status === 'hasNewRevision') {
      return null;
    }

    if (status === 'hasUnmentoredRevisions') {
      return null;
    }

    if (status === 'hasUnreadReply') {
      return this.unreadResponses.lastObject;
    }

    if (status === 'isWaitingForApproval') {
      return this.pendingApprovalResponses.lastObject;
    }

    if (status === 'inNeedOfRevisions') {
      return this.needsRevisionResponses.lastObject;
    }

    if (status === 'hasNewlyApprovedReply') {
      return this.newlyApprovedReplies.lastObject;
    }

    return this.latestReply;
  }

  get highestPrioritySubmission() {
    if (this.hasNewRevision) {
      return this.newRevisions.sortBy('createDate').lastObject;
    }

    if (this.hasUnmentoredRevisions) {
      return this.unmentoredRevisions.lastObject;
    }
    return [];
  }

  @computed('yourMentorReplies.@each.createDate')
  get yourLatestMentorReply() {
    return this.yourMentorReplies.sortBy('createDate').lastObject;
  }

  statusMap = {
    upToDate: {
      display: 'Up To Date',
      statusFill: '#35A853',
    },
    hasDraft: {
      display: 'Unfinished Draft',
      statusFill: '#778899',
      counterProp: 'draftCounter',
    },
    hasNewRevision: {
      display: 'New Revision',
      statusFill: '#3997EE',
      counterProp: 'newRevisionCounter',
    },
    hasUnmentoredRevisions: {
      display: 'Unmentored Revision',
      statusFill: '#3997EE',
      counterProp: 'unmentoredCounter',
    },
    hasUnreadReply: {
      display: 'Unread Reply',
      statusFill: '#3997EE',
      counterProp: 'unreadCounter',
    },
    isWaitingForApproval: {
      display: 'Pending Approval',
      statusFill: '#FFD204',
      counterProp: 'pendingApprovalCounter',
    },
    inNeedOfRevisions: {
      display: 'Needs Revisions',
      statusFill: '#EB5757',
      counterProp: 'needsRevisionCounter',
    },
    hasNewlyApprovedReply: {
      display: 'Newly Approved',
      statusFill: '#3997EE',
      counterProp: 'newlyApprovedCounter',
    },
  };

  get statusMessage() {
    return this.statusMap[this.highestPriorityStatus].display;
  }

  get statusIcon() {
    return this.statusMap[this.highestPriorityStatus].statusFill;
  }
}
