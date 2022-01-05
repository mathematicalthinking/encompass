import Model, { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { gt } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Model.extend(CurrentUserMixin, {
  utils: service('utility-methods'),
  store: service(),
  currentUser: service('current-user'),
  submissions: hasMany('submission'),
  responses: hasMany('response'),
  workspaceName: attr('string'),
  problemTitle: attr('string'),
  uniqueIdentifier: attr(),
  threadType: attr('string'), // submitter, mentor, approver
  studentDisplay: attr('string'),
  mentors: hasMany('user'),
  isNewThread: attr('boolean', { defaultValue: false }),
  hasNewRevision: gt('newRevisions.length', 0),
  mentorDisplay: computed('mentors', function () {
    return `${this.mentors.get(
      'firstObject.username'
    )}${this.mentors.length > 1 ? ', etc.' : ''}`;
  }),
  inNeedOfRevisions: gt('needsRevisionResponses.length', 0),
  isWaitingForApproval: gt('pendingApprovalResponses.length', 0),
  hasDraft: gt('draftResponses.length', 0),
  hasUnreadReply: gt('unreadResponses.length', 0),
  hasUnmentoredRevisions: gt('unmentoredRevisions.length', 0),
  hasNewlyApprovedReply: gt('newlyApprovedReplies.length', 0),

  relatedNewNtfs: computed(
    'newNotifications.[]',
    'cleanResponses.[]',
    'sortdRevisions',
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

  newNtfCount: computed('relatedNewNtfs.[]', function () {
    return this.get('relatedNewNtfs.length');
  }),

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
      return true;
    }
  ),

  cleanResponses: computed('responses.@each.isTrashed', function () {
    return this.get('responses').rejectBy('isTrashed').sortBy('createDate');
  }),

  unreadResponses: computed(
    'cleanResponses.@each.wasReadByRecipient',
    function () {
      return this.cleanResponses.filter((response) => {
        let recipientId = this.utils.getBelongsToId(response, 'recipient');
        return (
          !response.get('wasReadByRecipient') &&
          recipientId === this.currentUser.user.id
        );
      });
    }
  ),

  draftResponses: computed('cleanResponses.@each.status', function () {
    return this.cleanResponses.filterBy('status', 'draft');
  }),

  needsRevisionResponses: computed('cleanResponses.@each.status', function () {
    return this.cleanResponses.filterBy('status', 'needsRevisions');
  }),

  pendingApprovalResponses: computed(
    'cleanResponses.@each.status',
    function () {
      return this.cleanResponses.filterBy('status', 'pendingApproval');
    }
  ),

  latestReply: computed('cleanResponses.[]', function () {
    return this.get('cleanResponses.lastObject');
  }),

  sortedRevisions: computed('submissions.content.[]', function () {
    return this.get('submissions.content').sortBy('createDate');
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

  yourMentorReplies: computed('cleanResponses.@each.responseType', function () {
    return this.cleanResponses.filter((response) => {
      let creatorId = this.utils.getBelongsToId(response, 'createdBy');
      return (
        response.get('responseType') === 'mentor' &&
        creatorId === this.get('currentUser.id')
      );
    });
  }),

  newlyApprovedReplies: computed(
    'newNotifications.@each.notificationType',
    'cleanresponses.[]',
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

      let latestReplyDate = this.get('yourLatestMentorReply.createDate');

      return this.sortedRevisions.filter((submission) => {
        return (
          !mentoredRevisionIds.includes(submission.get('id')) &&
          submission.get('createDate') > latestReplyDate
        );
      });
    }
  ),

  latestRevision: computed('sortedRevisions.[]', function () {
    return this.get('sortedRevisions.lastObject');
  }),

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

  highestPriorityResponse: computed('highestPriorityStatus', function () {
    let status = this.highestPriorityStatus;

    if (status === 'hasDraft') {
      return this.get('draftResponses.lastObject');
    }

    if (status === 'hasNewRevision') {
      return null;
    }

    if (status === 'hasUnmentoredRevisions') {
      return null;
    }

    if (status === 'hasUnreadReply') {
      return this.get('unreadResponses.lastObject');
    }

    if (status === 'isWaitingForApproval') {
      return this.get('pendingApprovalResponses.lastObject');
    }

    if (status === 'inNeedOfRevisions') {
      return this.get('needsRevisionResponses.lastObject');
    }

    if (status === 'hasNewlyApprovedReply') {
      return this.get('newlyApprovedReplies.lastObject');
    }

    return this.latestReply;
  }),

  highestPrioritySubmission: computed('highestPriorityStatus', function () {
    if (this.hasNewRevision) {
      return this.newRevisions.sortBy('createDate').get('lastObject');
    }

    if (this.hasUnmentoredRevisions) {
      return this.get('unmentoredRevisions.lastObject');
    }
  }),

  yourLatestMentorReply: computed(
    'yourMentorReplies.@each.createDate',
    function () {
      return this.yourMentorReplies.sortBy('createDate').get('lastObject');
    }
  ),
  statusMap: {
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
  },
  statusMessage: computed('highestPriorityStatus', function () {
    const { display } = this.statusMap[this.highestPriorityStatus];
    return display;
  }),
  statusIcon: computed('highestPriorityStatus', function () {
    const { statusFill } = this.statusMap[this.highestPriorityStatus];
    return statusFill;
  }),
});
