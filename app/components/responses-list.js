/* eslint-disable complexity */
Encompass.ResponsesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'responses-list',

  utils: Ember.inject.service('utility-methods'),
  isShowAll: Ember.computed.equal('currentFilter', 'all'),

  isShowSubmitter: Ember.computed.equal('currentFilter', 'submitter'),
  isShowMentoring: Ember.computed.equal('currentFilter', 'mentoring'),
  isShowApproving: Ember.computed.equal('currentFilter', 'approving'),

  showSubmitterTab: Ember.computed.gt('submitterThreads.length', 0),
  showMentoringTab: Ember.computed.gt('mentoringThreads.length', 0),
  showApprovingTab: Ember.computed.gt('approvingThreads.length', 0),

  currentFilter: 'submitter',
  sortParam: 'newest',

  noResponsesMessage: 'No responses found',

  showStudentColumn: Ember.computed.equal('isShowMentoring', true),

  statusMap: {
    'approved': 'APPROVED',
    'pendingApproval': 'PENDING APPROVAL',
    'needsRevisions': 'NEEDS REVISIONS',
    'superceded': 'SUPERCEDED',
  },

  areThreads: Ember.computed.gt('allThreads.length', 0),

  didReceiveAttrs() {
    let list = [
      {name: 'sortedSubmitterResponses', actionCount : this.get('actionSubmitterThreads.length'), allCount: this.get('submitterThreads.length'), currentFilter: 'submitter'},
      {name: 'sortedMentoringResponses', actionCount: this.get('actionMentoringThreads.length'), allCount: this.get('mentoringThreads.length'), currentFilter: 'mentoring'},
      {name: 'sortedApprovingResponses', actionCount: this.get('actionApprovingThreads.length'), allCount: this.get('approvingThreads.length'), currentFilter: 'approving'}
    ];

    // ascending
    let sorted = list.sortBy('actionCount', 'allCount');

    this.set('currentFilter', sorted[2].currentFilter);

    this._super(...arguments);
  },
  newWorkToMentorNtfs: function() {
   let ntfs = this.get('notifications') || [];

   return ntfs.filterBy('notificationType', 'newWorkToMentor');

  }.property('notifications.@each.{wasSeen,isTrashed}'),

  showMentorHeader: function() {
    return this.get('currentFilter') !== 'mentoring';
  }.property('currentFilter'),

  showStudentHeader: function() {
    return this.get('currentFilter') !== 'submitter';
  }.property('currentFilter'),

  submissionThreads: function() {
    let hash = {};

    this.get('submissions').forEach((submission) => {
      let ntfs = this.get('newWorkToMentorNtfs');

      let subNtf = ntfs.find((ntf) => {
        let subId = this.get('utils').getBelongsToId(ntf, 'newSubmission');
        return subId === submission.get('id');
      });

      let isNew = true;
      if (subNtf) {
        console.log('submission NTF', subNtf.toJSON());
      }
      if (!subNtf || subNtf.get('isTrashed') || subNtf.get('wasSeen')) {
        isNew = false;
      }

      if (submission && !hash[submission.get('id')]) {
        hash[submission.get('id')] = {
          isNew,
          notifications: [],
          responses: [],
          mentoringResponses: [],
          submitterResponses: [],
          approvingResponses: [],
          submission
        };
      }
    });

    this.get('nonTrashedResponses').forEach((response) => {
      let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
      let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
      let submissionId = this.get('utils').getBelongsToId(response, 'submission');
      let approvedById = this.get('utils').getBelongsToId(response, 'approvedBy');

      let responseType = response.get('responseType');
      let status = response.get('status');

      let isToYou = recipientId === this.get('currentUser.id');
      let isByYou = creatorId === this.get('currentUser.id');

      let isYourMentorReply = isByYou && responseType === 'mentor';
      let isApproverNote = isToYou && response.get('isApproverNoteOnly');

      let wasApprovedByYou = approvedById === this.get('currentUser.id');
      let isYourApproverReply = isByYou && responseType === 'approver';
      let needsApproval = status === 'pendingApproval';
      let isReplyToApprove = (!isToYou && !isByYou) && needsApproval;

      if (hash[submissionId]) {
        hash[submissionId].responses.addObject(response);

        if (isToYou && responseType === 'mentor' && status === 'approved') {
          hash[submissionId].submitterResponses.addObject(response);
        }

        if (isYourMentorReply || isApproverNote) {
          hash[submissionId].mentoringResponses.addObject(response);
        }

        if ( isReplyToApprove || isYourApproverReply || wasApprovedByYou ) {
          hash[submissionId].approvingResponses.addObject(response);
        }

      }
    });

    return hash;

  }.property('nonTrashedResponses.[]', 'submissions.[]', 'newWorkToMentorNtfs.@each.{wasSeen,isTrashed}'),

  allThreads: function() {
    return Object.values(this.get('submissionThreads'));
  }.property('submissionThreads'),

  sortedAllThreads: function() {
    return this.get('allThreads').sort((a, b) => {
      let aResponses = a.responses;
      let bResponses = b.responses;

      if (aResponses.get('length') === 0 && bResponses.get('length') === 0) {
        // both are new, use submission create date
        return b.submission.get('createDate') - a.submission.get('createDate');
      }

      let doesAHaveUnreadReply = this.doesHaveUnreadReply(aResponses);
      let doesBHaveUnreadReply = this.doesHaveUnreadReply(bResponses);

      let isANew = a.isNew;
      let isBNew = b.isNew;

      let doesANeedRevisions = this.doesNeedRevisions(aResponses);
      let doesBNeedRevisions = this.doesNeedRevisions(bResponses);

      let isAWaitingForApproval = this.isWaitingForApproval(aResponses);
      let isBWaitingForApproval = this.isWaitingForApproval(bResponses);

      let isADraft = this.doesHaveDraft(aResponses);
      let isBDraft = this.doesHaveDraft(bResponses);

      let areANotesOnly = this.areUnreadNotesOnly(aResponses);
      let areBNotesOnly = this.areUnreadNotesOnly(bResponses);

      if (doesAHaveUnreadReply && !doesBHaveUnreadReply) {
        // sort action items before unread notes
        if (areANotesOnly && (isBWaitingForApproval || doesBNeedRevisions || isBDraft || isBNew)) {
          return 1;
        }
        return -1;
      }

      if (doesBHaveUnreadReply && !doesAHaveUnreadReply) {
        if (areBNotesOnly && (isAWaitingForApproval || doesANeedRevisions || isADraft || isANew)) {
          return -1;
        }
        return 1;
      }

      // both unread or both read , sort needsRevisiosn first
      if (isAWaitingForApproval && !isBWaitingForApproval) {
        return -1;
      }

      if (isBWaitingForApproval && !isAWaitingForApproval) {
        return 1;
      }

      if (doesANeedRevisions && !doesBNeedRevisions) {
        return -1;
      }

      if (doesBNeedRevisions && !doesANeedRevisions) {
        return 1;
      }

      if (isANew && !isBNew) {
        return -1;
      }

      if (isBNew && !isANew) {
        return 1;
      }

      let newestA = aResponses.sortBy('createDate').get('lastObject');
      let newestB = bResponses.sortBy('createDate').get('lastObject');

      // both need revisions or both dont need revisions, sort by newest first

      if (newestA && !newestB) {
        return 1;
      }

      if (!newestA && newestB) {
        return -1;
      }

      let momentA = moment(newestA.get('createDate'));
      let momentB = moment(newestB.get('createDate'));

      let diff = momentA.diff(momentB);

      if (diff > 0) {
        return -1;
      }
      if (diff < 0) {
        return 1;
      }
      return 0;
    });
  }.property('allThreads'),

  mentoringThreads: function() {
    return this.get('allThreads').filter((thread) => {
      let subCreatorId = thread.submission.get('creator.studentId');
      return subCreatorId !== this.get('currentUser.id');
    });
  }.property('allThreads'),

  sortedMentoringThreads: function() {
    return this.get('mentoringThreads').sort((a, b) => {
      let aResponses = a.mentoringResponses;
      let bResponses = b.mentoringResponses;

      let isANew = a.isNew;
      let isBNew = b.isNew;

      if (aResponses.get('length') === 0 && bResponses.get('length') === 0) {
        if (isANew && !isBNew) {
          return -1;
        }
        if (!isANew && isBNew) {
          return 1;
        }

        // both are new, use submission create date
        return b.submission.get('createDate') - a.submission.get('createDate');
      }

      let doesAHaveUnreadReply = this.doesHaveUnreadReply(aResponses);
      let doesBHaveUnreadReply = this.doesHaveUnreadReply(bResponses);



      let doesANeedRevisions = this.doesNeedRevisions(aResponses);
      let doesBNeedRevisions = this.doesNeedRevisions(bResponses);

      let isADraft = this.doesHaveDraft(aResponses);
      let isBDraft = this.doesHaveDraft(bResponses);

      let areANotesOnly = this.areUnreadNotesOnly(aResponses);
      let areBNotesOnly = this.areUnreadNotesOnly(bResponses);

      if (doesAHaveUnreadReply && !doesBHaveUnreadReply) {
        // sort action items before unread notes
        if (areANotesOnly && (doesBNeedRevisions || isBDraft || isBNew)) {
          return 1;
        }
        return -1;
      }

      if (doesBHaveUnreadReply && !doesAHaveUnreadReply) {
        if (areBNotesOnly && (doesANeedRevisions || isADraft || isANew)) {
          return -1;
        }
        return 1;
      }

      // both unread or both read , sort needsRevisiosn first

      if (doesANeedRevisions && !doesBNeedRevisions) {
        return -1;
      }

      if (doesBNeedRevisions && !doesANeedRevisions) {
        return 1;
      }

      if (isANew && !isBNew) {
        return -1;
      }

      if (isBNew && !isANew) {
        return 1;
      }

      let newestA = aResponses.sortBy('createDate').get('lastObject');
      let newestB = bResponses.sortBy('createDate').get('lastObject');

      // both need revisions or both dont need revisions, sort by newest first

      if (newestA && !newestB) {
        return 1;
      }

      if (!newestA && newestB) {
        return -1;
      }

      let momentA = moment(newestA.get('createDate'));
      let momentB = moment(newestB.get('createDate'));

      let diff = momentA.diff(momentB);

      if (diff > 0) {
        return -1;
      }
      if (diff < 0) {
        return 1;
      }
      return 0;

    });
  }.property('mentoringThreads'),

  mentoringResponses: function() {
    let responses = [];
    this.get('mentoringThreads').forEach((thread) => {
      responses.addObjects(thread.mentoringResponses);
    });
    return responses;
  }.property('mentoringThreads.[]'),

  actionMentoringThreads: function() {
    return this.get('mentoringThreads').filter((thread) => {
      if (thread.isNew) {
        return true;
      }
      let responses = thread.mentoringResponses || [];
      return this.doesHaveUnreadReply(responses) || this.doesNeedRevisions(responses) || this.doesHaveDraft(responses);
    });
  }.property('mentoringThreads.@each.isNew', 'mentoringResponses.@each.{wasReadByRecipient,status}'),

  submitterThreads: function() {
    return this.get('allThreads').filter((thread) => {
      return thread.submitterResponses.length > 0;
    });
  }.property('allThreads'),

  sortedSubmitterThreads: function() {
    return this.get('submitterThreads').sort((a, b) => {
      let aResponses = a.submitterResponses;
      let bResponses = b.submitterResponses;

      let doesAHaveUnreadReply = this.doesHaveUnreadReply(aResponses);
      let doesBHaveUnreadReply = this.doesHaveUnreadReply(bResponses);

      if (doesAHaveUnreadReply && !doesBHaveUnreadReply) {
        return -1;
      }

      if (doesBHaveUnreadReply && !doesAHaveUnreadReply) {
        return 1;
      }

      let newestA = aResponses.sortBy('createDate').get('lastObject');
      let newestB = bResponses.sortBy('createDate').get('lastObject');

      // both need revisions or both dont need revisions, sort by newest first

      if (newestA && !newestB) {
        return 1;
      }
      if (!newestA && newestB) {
        return -1;
      }

      // should always be at least one response

      let momentA = moment(newestA.get('createDate'));
      let momentB = moment(newestB.get('createDate'));

      let diff = momentA.diff(momentB);

      if (diff > 0) {
        return -1;
      }
      if (diff < 0) {
        return 1;
      }
      return 0;
    });
  }.property('submitterThreads'),

  submitterResponses: function() {
    let responses = [];
    this.get('submitterThreads').forEach((thread) => {
      responses.addObjects(thread.submitterResponses);
    });
    return responses;  }.property('submitterThreads.[]'),

  actionSubmitterThreads: function() {
    return this.get('submitterThreads').filter((thread) => {
      if (thread.isNew) {
        return true;
      }
      let responses = thread.submitterResponses || [];

      return this.doesHaveUnreadReply(responses);
    });
  }.property('submitterThreads.@each.isNew', 'submitterResponses.@each.{wasReadByRecipient}'),

  approvingThreads: function() {
    return this.get('allThreads').filter((thread) => {
      return thread.approvingResponses.length > 0;
    });
  }.property('allThreads'),

  sortedApprovingThreads: function() {
    return this.get('approvingThreads').sort((a, b) => {
      let aResponses = a.approvingResponses;
      let bResponses = b.approvingResponses;

      if (aResponses.get('length') === 0 && bResponses.get('length') === 0) {
        // both are new, use submission create date
        return b.submission.get('createDate') - a.submission.get('createDate');
      }

      let doesAHaveUnreadReply = this.doesHaveUnreadReply(aResponses);
      let doesBHaveUnreadReply = this.doesHaveUnreadReply(bResponses);

      if (doesAHaveUnreadReply && !doesBHaveUnreadReply) {
        return -1;
      }

      if (doesBHaveUnreadReply && !doesAHaveUnreadReply) {
        return 1;
      }

      let isADraft = this.doesHaveDraft(aResponses);
      let isBDraft = this.doesHaveDraft(bResponses);

      if (isADraft && !isBDraft) {
        return -1;
      }
      if (isBDraft && !isADraft) {
        return 1;
      }

      let doesANeedApproval = this.isWaitingForApproval(aResponses);
      let doesBNeedApproval = this.isWaitingForApproval(bResponses);

      if (doesANeedApproval && !doesBNeedApproval) {
        return -1;
      }

      if (doesBNeedApproval && !doesANeedApproval) {
        return 1;
      }

      let newestA = aResponses.sortBy('createDate').get('lastObject');
      let newestB = bResponses.sortBy('createDate').get('lastObject');

      // both need revisions or both dont need revisions, sort by newest first
      if (newestA && !newestB) {
        return -1;
      }

      if (!newestA && newestB) {
        return 1;
      }

      let momentA = moment(newestA.get('createDate'));
      let momentB = moment(newestB.get('createDate'));

      let diff = momentA.diff(momentB);

      if (diff > 0) {
        return -1;
      }
      if (diff < 0) {
        return 1;
      }
      return 0;

    });
  }.property('approvingThreads'),

  approvingResponses: function() {
    let responses = [];
    this.get('approvingThreads').forEach((thread) => {
      responses.addObjects(thread.approvingResponses);
    });
    return responses;
  }.property('approvingThreads.[]'),

  actionApprovingThreads: function() {
    return this.get('approvingThreads').filter((thread) => {
      if (thread.isNew) {
        return true;
      }
      let responses = thread.approvingResponses || [];

      return this.doesHaveUnreadReply(responses) || this.isWaitingForApproval(responses) || this.doesHaveDraft(responses);
    });
  }.property('approvingThreads.@each.isNew', 'approvingResponses.@each.{status,wasReadByRecipient}'),

  areAnyActionItems: function() {
    return this.get('actionSubmitterThreads.length') > 0 || this.get('actionMentoringThreads.length') > 0 || this.get('actionApprovingThreads.length') > 0;
  }.property('actionSubmitterThreads.[]', 'actionMentoringThreads.[]', 'actionApprovingThreads.[]'),

  displayThreads: function() {
    let val = this.get('currentFilter');
    if (val === 'submitter') {
      return this.get('sortedSubmitterThreads');
    }
    if (val === 'mentoring') {
      return this.get('sortedMentoringThreads');
    }

    if (val === 'approving') {
      return this.get('sortedApprovingThreads');
    }

    if (val === 'all') {
      return this.get('sortedAllThreads');
    }
  }.property('currentFilter'),

  submitterActionItems: function() {
    return this.get('submitterResponses').rejectBy('wasReadByRecipient');
  }.property('submitterResponses.@each.wasReadByRecipient'),

  mentoringActionItems: function() {
    return this.get('mentoringResponses').filter((response) => {
      return !response.get('wasReadByRecipient') && response.get('status') === 'needsRevisions';
    });
  }.property('mentoringResponses.@each.{wasReadByRecipient,status}'),

  approvingActionItems: function() {
    return this.get('approvingResponses').filter((response) => {
      return !response.get('wasReadByRecipient') && response.get('status') === 'pendingApproval';
    });
  }.property('approvingResponses.@each.{wasReadByRecipient,status}'),

  submitterCounter: function() {
    let count = this.get('actionSubmitterThreads.length');

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('actionSubmitterThreads.[]'),

  mentoringCounter: function() {
    let count = this.get('actionMentoringThreads.length');

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('actionMentoringThreads.[]'),

  approvingCounter: function() {
    let count = this.get('actionApprovingThreads.length');

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('actionApprovingThreads.[]'),

  showAllFilter: function() {
    return !this.get('currentUser.isStudent') && this.get('currentUser.isAdmin');
  }.property('currentUser.isStudent', 'currentUser.isAdmin'),

  showStatusColumn: function() {
    return this.get('currentFilter') === 'mentoring' || this.get('currentFilter') === 'approving' || this.get('currentFilter') === 'all';
  }.property('currentFilter'),

  nonTrashedResponses: function() {
    return this.get('responses').rejectBy('isTrashed');
  }.property('responses.@each.isTrashed'),

  doesHaveUnreadReply(responses) {
      if (!responses) {
        return false;
      }
      let unreadReply = responses.find((response) => {
        let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
        return !response.get('wasReadByRecipient') && recipientId === this.get('currentUser.id');
      });
      return !this.get('utils').isNullOrUndefined(unreadReply);
  },

  areUnreadNotesOnly(responses) {
    if (!responses) {
      return false;
    }
    let unreadReplies = responses.filter((response) => {
      let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
      return !response.get('wasReadByRecipient') && creatorId === this.get('currentUser.id');
    });

    if (unreadReplies.get('length') === 0) {
      return false;
    }

    let nonNotes = unreadReplies.rejectBy('isApproverNoteOnly');
    return unreadReplies.length === nonNotes.get('length');
  },

  doesNeedRevisions(responses) {
    if (!responses) {
      return false;
    }
    let reply = responses.find((response) => {
      return response.get('status') === 'needsRevisions';
    });
    return !this.get('utils').isNullOrUndefined(reply);
},

  isWaitingForApproval(responses) {
    if (!responses) {
      return false;
    }
    let reply = responses.find((response) => {
      return response.get('status') === 'pendingApproval';
    });
    return !this.get('utils').isNullOrUndefined(reply);
  },

  doesHaveDraft(responses) {
    if (!responses) {
      return false;
    }
    let reply = responses.find((response) => {
      return response.get('status') === 'draft';
    });
    return !this.get('utils').isNullOrUndefined(reply);
  },

  actions: {
    showSubmitterResponses() {
      this.set('currentFilter', 'submitter');
    },
    showApprovingResponses() {
      this.set('currentFilter', 'approving');
    },
    showMentoringResponses() {
      this.set('currentFilter', 'mentoring');
    },
    showAllResponses() {
      this.set('currentFilter', 'all');

    },
    toSubmissionResponse(sub) {
      this.sendAction('toSubmissionResponse', sub.get('id'));
    },
    refreshList() {
      this.sendAction('toResponses');
    },
  }
});
