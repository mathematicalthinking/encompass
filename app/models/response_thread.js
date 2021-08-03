import Model, { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { gt } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Model.extend(CurrentUserMixin, {
  utils: service('utility-methods'),
  store: service(),

  submissions: hasMany('submission'),
  responses: hasMany('response'),
  workspaceName: attr('string'),
  problemTitle: attr('string'),
  uniqueIdentifier: attr(),
  threadType: attr('string'), // submitter, mentor, approver
  studentDisplay: attr('string'),
  mentors: attr(),
  isNewThread: attr('boolean', { defaultValue: false }),
  hasNewRevision: gt('newRevisions.length', 0),

  inNeedOfRevisions: gt('needsRevisionResponses.length', 0),
  isWaitingForApproval: gt('pendingApprovalResponses.length', 0),
  hasDraft: gt('draftResponses.length', 0),
  hasUnreadReply: gt('unreadResponses.length', 0),
  hasUnmentoredRevisions: gt('unmentoredRevisions.length', 0),
  hasNewlyApprovedReply: gt('newlyApprovedReplies.length', 0),

  relatedNewNtfs: computed(
    'cleanResponses.[]',
    'newNotifications.[]',
    'sortdRevisions',
    'sortedRevisions',
    function () {
      return this.newNotifications.filter((ntf) => {
        if (ntf.get('primaryRecordType') !== 'response') {
          return false;
        }
        let responseId = this.utils.getBelongsToId(ntf, 'response');
        let subId = this.utils.getBelongsToId(ntf, 'submission');

        let foundResponse = this.cleanResponses.find((response) => {
          return response.get('id') === responseId;
        });

        if (foundResponse) {
          return true;
        }
        return this.sortedRevisions.find((sub) => {
          return sub.get('id') === subId;
        });
      });
    }
  ),

  newNtfCount: computed.reads('relatedNewNtfs.length'),

  sortPriority: computed(
    'threadType',
    'hasDraft',
    'hasUnreadReply',
    'hasUnmentoredRevisions',
    'hasNewlyApprovedReply',
    'hasNewRevision',
    'isWaitingForApproval',
    'inNeedOfRevisions',
    function () {
      let threadType = this.threadType;
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
  ),

  getApprovingPriority: function () {
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
  },

  getSubmitterPriority: function () {
    let sum = 0;
    if (this.hasUnreadReply) {
      sum += 10;
    }
    return sum;
  },

  getMentoringPriority: function () {
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
  },

  isActionNeeded: computed(
    'hasUnreadReply',
    'hasDraft',
    'isWaitingForApproval',
    'inNeedOfRevisions',
    'hasNewRevision',
    'threadType',
    function () {
      let type = this.threadType;

      if (this.hasUnreadReply || this.hasDraft) {
        return true;
      }
      if (type === 'mentor') {
        return this.inNeedOfRevisions || this.hasNewRevision;
      }

      if (type === 'approver') {
        return this.isWaitingForApproval;
      }
    }
  ),

  cleanResponses: computed('responses.content.@each.isTrashed', function () {
    return this.responses.content.rejectBy('isTrashed').sortBy('createDate');
  }),

  unreadResponses: computed(
    'cleanResponses.@each.wasReadByRecipient',
    'currentUser.id',
    function () {
      return this.cleanResponses.filter((response) => {
        let recipientId = this.utils.getBelongsToId(response, 'recipient');
        return (
          !response.get('wasReadByRecipient') &&
          recipientId === this.currentUser.id
        );
      });
    }
  ),

  draftResponses: computed.filterBy('cleanResponses', 'status', 'draft'),

  needsRevisionResponses: computed.filterBy(
    'cleanResponses',
    'status',
    'needsRevisions'
  ),

  pendingApprovalResponses: computed.filterBy(
    'cleanResponses',
    'status',
    'pendingApproval'
  ),

  latestReply: computed.reads('cleanResponses.lastObject'),

  sortedRevisions: computed('submissions.content.[]', function () {
    return this.submissions.content.sortBy('createDate');
  }),

  newRevisions: computed(
    'newNotifications.[]',
    'sortedRevisions.[]',
    function () {
      let newWorkNtfs = this.newNotifications.filterBy(
        'notificationType',
        'newWorkToMentor'
      );

      let newSubIds = newWorkNtfs
        .map((ntf) => {
          return this.utils.getBelongsToId(ntf, 'submission');
        })
        .compact()
        .uniq();
      return this.sortedRevisions.filter((sub) => {
        return newSubIds.includes(sub.get('id'));
      });
    }
  ),

  yourMentorReplies: computed(
    'cleanResponses.@each.responseType',
    'currentUser.id',
    function () {
      return this.cleanResponses.filter((response) => {
        let creatorId = this.utils.getBelongsToId(response, 'createdBy');
        return (
          response.get('responseType') === 'mentor' &&
          creatorId === this.currentUser.id
        );
      });
    }
  ),

  newlyApprovedReplies: computed(
    'cleanResponses',
    'cleanresponses.[]',
    'newNotifications.@each.notificationType',
    function () {
      let newlyApprovedNtfs = this.newNotifications.filterBy(
        'notificationType',
        'newlyApprovedReply'
      );

      let newResponseIds = newlyApprovedNtfs
        .map((ntf) => {
          return this.utils.getBelongsToId(ntf, 'response');
        })
        .compact()
        .uniq();

      let newlyApprovedReplies = this.cleanResponses
        .filter((response) => {
          let existingId = response.get('id');
          return newResponseIds.includes(existingId);
        })
        .compact();

      return newlyApprovedReplies;
    }
  ),

  unmentoredRevisions: computed(
    'yourMentorReplies.[]',
    'sortedRevisions.@each.createDate',
    'threadType',
    'yourLatestMentorReply.createDate',
    function () {
      if (this.threadType !== 'mentor') {
        return [];
      }
      let mentoredRevisionIds = this.yourMentorReplies
        .map((response) => {
          return this.utils.getBelongsToId(response, 'submission');
        })
        .compact()
        .uniq();

      let latestReplyDate = this.yourLatestMentorReply.createDate;

      return this.sortedRevisions.filter((submission) => {
        return (
          !mentoredRevisionIds.includes(submission.get('id')) &&
          submission.get('createDate') > latestReplyDate
        );
      });
    }
  ),

  latestRevision: computed.reads('sortedRevisions.lastObject'),

  highestPriorityStatus: computed(
    'hasDraft',
    'hasUnreadReply',
    'isWaitingForApproval',
    'hasNewRevision',
    'hasUnmentoredRevisions',
    'inNeedOfRevisions',
    'hasNewlyApprovedReply',
    function () {
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
  ),

  highestPriorityResponse: computed(
    'draftResponses.lastObject',
    'highestPriorityStatus',
    'latestReply',
    'needsRevisionResponses.lastObject',
    'newlyApprovedReplies.lastObject',
    'pendingApprovalResponses.lastObject',
    'unreadResponses.lastObject',
    function () {
      let status = this.highestPriorityStatus;

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
  ),

  highestPrioritySubmission: computed(
    'hasNewRevision',
    'hasUnmentoredRevisions',
    'highestPriorityStatus',
    'newRevisions',
    'unmentoredRevisions.lastObject',
    function () {
      if (this.hasNewRevision) {
        return this.newRevisions.sortBy('createDate').get('lastObject');
      }

      if (this.hasUnmentoredRevisions) {
        return this.unmentoredRevisions.lastObject;
      }
    }
  ),

  yourLatestMentorReply: computed(
    'yourMentorReplies.@each.createDate',
    function () {
      return this.yourMentorReplies.sortBy('createDate').get('lastObject');
    }
  ),
});
