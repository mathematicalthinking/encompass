Encompass.ResponseThread = DS.Model.extend(Encompass.CurrentUserMixin, {
  utils: Ember.inject.service('utility-methods'),
  store: Ember.inject.service(),

  submissions: DS.hasMany('submission'),
  responses: DS.hasMany('response'),
  workspaceName: DS.attr('string'),
  problemTitle: DS.attr('string'),
  uniqueIdentifier: DS.attr(),
  threadType: DS.attr('string'),
  studentDisplay: DS.attr('string'),
  mentors: DS.attr(),
  isNewThread: DS.attr('boolean', { default: false }),
  hasNewRevision: Ember.computed.gt('newRevisions.length', 0),

  inNeedOfRevisions: Ember.computed.gt('needsRevisionResponses.length', 0),
  isWaitingForApproval: Ember.computed.gt('pendingApprovalResponses.length', 0),
  hasDraft: Ember.computed.gt('draftResponses.length', 0),
  hasUnreadReply: Ember.computed.gt('unreadResponses.length', 0),
  hasUnmentoredRevisions: Ember.computed.gt('unmentoredRevisions.length', 0),
  hasNewlyApprovedReply: Ember.computed.gt('newlyApprovedReplies.length', 0),

  relatedNewNtfs: function() {
    return this.get('newNotifications').filter((ntf) => {
      if (ntf.get('primaryRecordType') !== 'response') {
        return false;
      }
      let responseId = this.get('utils').getBelongsToId(ntf, 'response');
      let subId = this.get('utils').getBelongsToId(ntf, 'submission');

      let foundResponse = this.get('cleanResponses').find((response) => {
        return response.get('id') === responseId;
      });

      if (foundResponse) {
        return true;
      }
      return this.get('sortedRevisions').find((sub) => {
        return sub.get('id') === subId;
      });
    });
  }.property('newNotifications.[]', 'cleanResponses.[]', 'sortdRevisions'),

  newNtfCount: function() {
    return this.get('relatedNewNtfs.length');
  }.property('relatedNewNtfs.[]'),

  sortPriority: function() {
    let threadType = this.get('threadType');
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
  }.property('threadType', 'hasDraft', 'hasUnreadReply', 'hasUnmentoredRevisions', 'hasNewlyApprovedReply', 'hasNewRevision', 'isWaitingForApproval', 'inNeedOfRevisions'),

  getApprovingPriority: function() {
    let sum = 0;
    if (this.get('hasDraft')) {
      sum += 100;
    }
    if (this.get('isWaitingForApproval')) {
      sum += 10;
    }
    if (this.get('hasUnreadReply')) {
      sum += 1;
    }
    return sum;
  },

  getSubmitterPriority: function() {
    let sum = 0;
    if (this.get('hasUnreadReply')) {
      sum += 10;
    }
    return sum;
  },

  getMentoringPriority: function() {
    let sum = 0;

    if (this.get('hasDraft')) {
      sum += 500;
    }
    if (this.get('inNeedOfRevisions')) {
      sum += 300;
    }
    if (this.get('hasNewRevision')) {
      sum += 100;
    }
    if (this.get('hasUnmentoredRevisions')) {
      sum += 25;
    }

    if (this.get('hasUnreadReply')) {
      sum += 10;
    }
    if (this.get('hasNewlyApprovedReply')) {
      sum += 5;
    }

    if (this.get('isWaitingForApproval')) {
      sum += 1;
    }
    return sum;
  },

  isActionNeeded: function() {
    return this.get('hasUnreadReply') || this.get('hasDraft') || this.get('isWaitingForApproval') || this.get('inNeedOfRevisions') || this.get('hasNewRevision');
  }.property('hasUnreadReply', 'hasDraft', 'isWaitingForApproval', 'inNeedOfRevisions', 'hasNewRevision'),

  cleanResponses: function() {
    return this.get('responses.content').rejectBy('isTrashed').sortBy('createDate');
  }.property('responses.content.@each.isTrashed'),

  unreadResponses: function() {
    return this.get('cleanResponses').filter((response) => {
      let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
      return !response.get('wasReadByRecipient') && recipientId === this.get('currentUser.id');
    });
  }.property('cleanResponses.@each.wasReadByRecipient'),

  draftResponses: function() {
    return this.get('cleanResponses').filterBy('status', 'draft');
  }.property('cleanResponses.@each.status'),

  needsRevisionResponses: function() {
    return this.get('cleanResponses').filterBy('status', 'needsRevisions');
  }.property('cleanResponses.@each.status'),

  pendingApprovalResponses: function() {
    return this.get('cleanResponses').filterBy('status', 'pendingApproval');
  }.property('cleanResponses.@each.status'),

  latestReply: function() {
    return this.get('cleanResponses.lastObject');
  }.property('cleanResponses.[]'),

  sortedRevisions: function() {
    return this.get('submissions.content').sortBy('createDate');
  }.property('submissions.content.[]'),

  newRevisions: function() {
    let newWorkNtfs = this.get('newNotifications').filterBy('notificationType', 'newWorkToMentor');

    let newSubIds = newWorkNtfs.map((ntf) => {
      return this.get('utils').getBelongsToId(ntf, 'submission');
    }).compact().uniq();
    return this.get('sortedRevisions').filter((sub) => {
      return newSubIds.includes(sub.get('id'));
    });

  }.property('newNotifications.[]', 'sortedRevisions.[]'),

  yourMentorReplies: function() {
    return this.get('cleanResponses').filter((response) => {
      let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
      return response.get('responseType') === 'mentor' && creatorId === this.get('currentUser.id');
    });
  }.property('cleanResponses.@each.responseType'),

  newlyApprovedReplies: function() {
    let newlyApprovedNtfs = this.get('newNotifications').filterBy('notificationType', 'newlyApprovedReply');

    let newResponseIds = newlyApprovedNtfs.map((ntf) => {
      return this.get('utils').getBelongsToId(ntf, 'response');
    }).compact().uniq();

    let newlyApprovedReplies = this.get('cleanResponses').filter((response) => {
      let existingId = response.get('id');
      return newResponseIds.includes(existingId);
    }).compact();

    return newlyApprovedReplies;
  }.property('newNotifications.@each.notificationType', 'cleanresponses.[]'),

  unmentoredRevisions: function() {
    if (this.get('threadType') !== 'mentor') {
      return [];
    }
    let mentoredRevisionIds = this.get('yourMentorReplies').map((response) => {
      return this.get('utils').getBelongsToId(response, 'submission');
    }).compact().uniq();
   return this.get('sortedRevisions').filter((submission) => {
      return !mentoredRevisionIds.includes(submission.get('id'));
   });
 }.property('yourMentorReplies.[]', 'sortedRevisions.[]', 'threadType'),

  latestRevision: function() {
    return this.get('sortedRevisions.lastObject');
  }.property('sortedRevisions.[]'),

  highestPriorityStatus: function() {
    if (this.get('hasDraft')) {
      return 'hasDraft';
    }

    if (this.get('hasNewRevision')) {
      return 'hasNewRevision';
    }

    if (this.get('hasUnmentoredRevisions')) {
      return 'hasUnmentoredRevisions';
    }

    if (this.get('hasUnreadReply')) {
      return 'hasUnreadReply';
    }

    if (this.get('isWaitingForApproval')) {
      return 'isWaitingForApproval';
    }
    if (this.get('inNeedOfRevisions')) {
      return 'inNeedOfRevisions';
    }

    if (this.get('hasNewlyApprovedReply')) {
      return 'hasNewlyApprovedReply';
    }

    return 'upToDate';

  }.property('hasDraft', 'hasUnreadReply', 'isWaitingForApproval', 'hasNewRevision', 'hasUnmentoredRevisions', 'inNeedOfRevisions', 'hasNewlyApprovedReply'),

  highestPriorityResponse: function() {
    let status = this.get('highestPriorityStatus');

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

    return this.get('latestReply');

  }.property('highestPriorityStatus'),

  highestPrioritySubmission: function() {
    if (this.get('hasNewRevision')) {
      return this.get('newRevisions').sortBy('createDate').get('lastObject');
    }

    if (this.get('hasUnmentoredRevisions')) {
      return this.get('unmentoredRevisions.lastObject');
    }
  }.property('highestPriorityStatus'),

});