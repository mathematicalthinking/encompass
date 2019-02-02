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

  areDisplayResponses: Ember.computed.gt('displayResponses.length', 0),
  areNoResponses: Ember.computed.not('areDisplayResponses'),
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
      {name: 'sortedSubmitterResponses', actionCount : this.get('submitterActionItems.length'), allCount: this.get('submitterResponses.length'), currentFilter: 'submitter'},
      {name: 'sortedMentoringResponses', actionCount: this.get('mentoringActionItems.length'), allCount: this.get('mentoringResponses.length'), currentFilter: 'mentoring'},
      {name: 'sortedApprovingResponses', actionCount: this.get('approvingActionItems.length'), allCount: this.get('approvingResponses.length'), currentFilter: 'approving'}
    ];

    // ascending
    let sorted = list.sortBy('actionCount', 'allCount');

    this.set('filteredResponses', this.get(sorted[2].name));
    this.set('currentFilter', sorted[2].currentFilter);

    this._super(...arguments);
  },

  showMentorHeader: function() {
    return this.get('currentFilter') !== 'mentoring';
  }.property('currentFilter'),

  showStudentHeader: function() {
    return this.get('currentFilter') !== 'submitter';
  }.property('currentFilter'),

  submissionThreads: function() {
    let hash = {};

    this.get('newSubmissions').forEach((submission) => {
      if (submission && !hash[submission.get('id')]) {
        hash[submission.get('id')] = {
          isNew: true,
          notifications: [],
          responses: [],
          mentoringResponses: [],
          submitterResponses: [],
          approvingResponses: [],
          submission
        };
      }
    });

    this.get('responseSubmissions').forEach((submission) => {
      if (submission && !hash[submission.get('id')]) {
        hash[submission.get('id')] = {
          isNew: false,
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

  }.property('nonTrashedResponses.[]', 'responseSubmissions.[]', 'newSubmissions.[]'),

  allThreads: function() {
    return Object.values(this.get('submissionThreads'));
  }.property('submissionThreads'),

  mentoringThreads: function() {
    return this.get('allThreads').filter((thread) => {
      return thread.mentoringResponses.length > 0 || thread.isNew;
    });
  }.property('allThreads'),

  sortedMentoringThreads: function() {
    return this.get('mentoringThreads').sort((a, b) => {
      let aResponses = a.mentoringResponses;
      let bResponses = b.mentoringResponses;

      let doesAHaveUnreadReply = this.doesHaveUnreadReply(aResponses);
      let doesBHaveUnreadReply = this.doesHaveUnreadReply(bResponses);

      let isANew = a.isNew;
      let isBNew = b.isNew;

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
  }.property('mentoringThreads'),

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
      if (!newestA && newestB) {
        return 1;
      }
      if (newestA && !newestB) {
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

  approvingThreads: function() {
    return this.get('allThreads').filter((thread) => {
      return thread.approvingResponses.length > 0;
    });
  }.property('allThreads'),

  sortedApprovingThreads: function() {
    return this.get('approvingThreads').sort((a, b) => {
      let aResponses = a.approvingResponses;
      let bResponses = b.approvingResponses;

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

  areAnyActionItems: function() {
    return this.get('submitterActions.length') > 0 || this.get('mentoringActionItems.length') > 0 || this.get('approvingActionItems.length') > 0;
  }.property('submitterActionItems.[]', 'mentoringActionItems.[]', 'approvingActionItems.[]'),

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
    let count = this.get('submitterActionItems.length');

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('submitterActionItems.[]'),

  mentoringCounter: function() {
    let count = this.get('mentoringActionItems.length');

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('mentoringActionItems.[]'),

  approvingCounter: function() {
    let count = this.get('approvingActionItems.length');

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }.property('approvingActionItems.[]'),

  showAllFilter: function() {
    return !this.get('currentUser.isStudent') && this.get('currentUser.isAdmin');
  }.property('currentUser.isStudent', 'currentUser.isAdmin'),

  showStatusColumn: function() {
    return this.get('currentFilter') === 'mentoring' || this.get('currentFilter') === 'approving' || this.get('currentFilter') === 'all';
  }.property('currentFilter'),

  displayResponses: function() {
    return this.get('filteredResponses');
  }.property('filteredResponses.[]'),

  sortResponses(responses, sortParam) {
    if (!responses) {
      return [];
    }
    if (sortParam === 'newest' || !sortParam) {
      return responses.sortBy('createDate').reverse();
    }

    return responses.sortBy('createDate');
  },
  nonTrashedResponses: function() {
    return this.get('responses').rejectBy('isTrashed');
  }.property('responses.@each.isTrashed'),

  filterByStatus(status, responses) {
    if (!this.get(`statusMap.${status}`)) {
      return responses;
    }
    if (!responses) {
      return [];
    }
    return responses.filterBy('status', status);
  },

  filterByRecipient(recipientId, responses) {
    if (!recipientId) {
      return responses;
    }

    if (!responses) {
      return [];
    }

    return responses.filter((response) => {
      let recipId = response.belongsTo('recipient').id();
      return recipId === recipientId;
    });

  },

  filterByCreatedBy(creatorId, responses ) {
    if (!creatorId) {
      return responses;
    }

    if (!responses) {
      return [];
    }

    return responses.filter((response) => {
      let id = response.belongsTo('createdBy').id();
      return creatorId === id;
    });
  },

  submitterResponses: function() {
    return this.get('nonTrashedResponses').filter((response) => {
      let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
      return recipientId === this.get('currentUser.id') && response.get('status') === 'approved' && response.get('responseType') === 'mentor';
    });
  }.property('nonTrashedResponses.[]', 'currentUser'),

  mentoringResponses: function() {
    return this.get('nonTrashedResponses').filter((response) => {
      let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
      let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
      let isByYou = creatorId === this.get('currentUser.id');
      let isToYou = recipientId === this.get('currentUser.id');

      let isYourMentorReply = isByYou && response.get('responseType') === 'mentor';
      let isApproverNote = isToYou && response.get('isApproverNoteOnly');
      let isNewRevisionNotice = isToYou && response.get('responseType') === 'newRevisionNotice';

      return isYourMentorReply || isApproverNote || isNewRevisionNotice;
    });
  }.property('nonTrashedResponses.[]', 'currentUser'),

  approvingResponses: function() {
    return this.get('nonTrashedResponses').filter((response) => {
      let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
      let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
      let approvedById = this.get('utils').getBelongsToId(response, 'approvedBy');

      let isByYou = creatorId === this.get('currentUser.id');
      let isToYou = recipientId === this.get('currentUser.id');

      let wasApprovedByYou = approvedById === this.get('currentUser.id');
      let isYourApproverReply = isByYou && response.get('responseType') === 'approver';
      let needsApproval = response.get('status') === 'pendingApproval';
      let isReplyToApprove = (!isToYou && !isByYou) && needsApproval;

      return isReplyToApprove || isYourApproverReply || wasApprovedByYou;
    });
  }.property('nonTrashedResponses.[]', 'currentUser'),

  // sortedAllResponses: function() {
  //   return this.get('nonTrashedResponses').sort((a, b) => {
  //     let isAUnread = this.isResponseUnread(a, this.get('currentUser.id'));
  //     let isBUnread = this.isResponseUnread(b, this.get('currentUser.id'));

  //     if (isAUnread && !isBUnread) {
  //       return -1;
  //     }

  //     if (isBUnread && !isAUnread) {
  //       return 1;
  //     }

  //     // both unread , sort newest first
  //     let momentA = moment(a.get('createDate'));
  //     let momentB = moment(b.get('createDate'));

  //     let diff = momentA.diff(momentB);

  //     if (diff > 0) {
  //       return -1;
  //     }
  //     if (diff < 0) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  // }.property('nonTrashedResponses.[]'),

  // sortedSubmitterResponses: function() {
  //   return this.get('submitterResponses').sort((a, b) => {
  //     let isAUnread = this.isResponseUnread(a, this.get('currentUser.id'));
  //     let isBUnread = this.isResponseUnread(b, this.get('currentUser.id'));

  //     if (isAUnread && !isBUnread) {
  //       return -1;
  //     }

  //     if (isBUnread && !isAUnread) {
  //       return 1;
  //     }

  //     // both unread , sort newest first
  //     let momentA = moment(a.get('createDate'));
  //     let momentB = moment(b.get('createDate'));

  //     let diff = momentA.diff(momentB);

  //     if (diff > 0) {
  //       return -1;
  //     }
  //     if (diff < 0) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  // }.property('submitterResponses.[]'),

  // sortedApprovingResponses: function() {
  //   return this.get('approvingResponses').sort((a, b) => {
  //     let isAUnread = this.isResponseUnread(a, this.get('currentUser.id'));
  //     let isBUnread = this.isResponseUnread(b, this.get('currentUser.id'));

  //     if (isAUnread && !isBUnread) {
  //       return -1;
  //     }

  //     if (isBUnread && !isAUnread) {
  //       return 1;
  //     }

  //     let isADraft = a.get('status') === 'draft';
  //     let isBDraft = b.get('status') === 'draft';

  //     if (isADraft && !isBDraft) {
  //       return -1;
  //     }
  //     if (isBDraft && !isADraft) {
  //       return 1;
  //     }
  //     // both unread or both read , sort  by pending first

  //     let isAPendingApproval = a.get('status') === 'pendingApproval';
  //     let isBPendingApproval = b.get('status') === 'pendingApproval';

  //     if (isAPendingApproval && !isBPendingApproval) {
  //       return -1;
  //     }

  //     if (isBPendingApproval && !isAPendingApproval) {
  //       return 1;
  //     }

  //     // both pending or both not pending, sort by newest first

  //     let momentA = moment(a.get('createDate'));
  //     let momentB = moment(b.get('createDate'));

  //     let diff = momentA.diff(momentB);

  //     if (diff > 0) {
  //       return -1;
  //     }
  //     if (diff < 0) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  // }.property('approvingResponses.[]'),

  // sortedMentoringResponses: function() {
  //   return this.get('mentoringResponses').sort((a, b) => {
  //     let isAUnread = this.isResponseUnread(a, this.get('currentUser.id'));
  //     let isBUnread = this.isResponseUnread(b, this.get('currentUser.id'));

  //     let isANoteOnly = a.get('isApproverNoteOnly');
  //     let isBNoteOnly = b.get('isApproverNoteOnly');

  //     let doesANeedsRevisions = a.get('status') === 'needsRevisions';
  //     let doesBNeedRevisions = b.get('status') === 'needsRevisions';

  //     let isADraft = a.get('status') === 'draft';
  //     let isBDraft = b.get('status') === 'draft';

  //     if (isAUnread && !isBUnread) {
  //       // sort action items before unread notes
  //       if (isANoteOnly && (doesBNeedRevisions || isBDraft)) {
  //         return 1;
  //       }
  //       return -1;
  //     }

  //     if (isBUnread && !isAUnread) {
  //       if (isBNoteOnly && (doesANeedsRevisions || isADraft)) {
  //         return -1;
  //       }
  //       return 1;
  //     }

  //     // both unread or both read , sort needsRevisiosn first

  //     if (doesANeedsRevisions && !doesBNeedRevisions) {
  //       return -1;
  //     }

  //     if (doesBNeedRevisions && !doesANeedsRevisions) {
  //       return 1;
  //     }

  //     // both need revisions or both dont need revisions, sort by newest first

  //     let momentA = moment(a.get('createDate'));
  //     let momentB = moment(b.get('createDate'));

  //     let diff = momentA.diff(momentB);

  //     if (diff > 0) {
  //       return -1;
  //     }
  //     if (diff < 0) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  // }.property('mentoringResponses'),
  // isResponseUnread(response, userId) {
  //   if (!userId) {
  //     userId = this.get('currentUser.id');
  //   }

  //   if (!response || !userId) {
  //     return;
  //   }
  //   let recipientRef = response.belongsTo('recipient');
  //   let recipientId;

  //   if (recipientRef) {
  //     recipientId = recipientRef.id();
  //   }

  //   return !response.get('wasReadByRecipient') && userId === recipientId;
  // },

  doesHaveUnreadReply(responses) {
      if (!responses) {
        return false;
      }
      let unreadReply = responses.find((response) => {
        let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
        return !response.getWasReadByRecipient && creatorId === this.get('currentUser.id');
      });
      return !this.get('utils').isNullOrUndefined(unreadReply);
  },

  areUnreadNotesOnly(responses) {
    if (!responses) {
      return false;
    }
    let unreadReplies = responses.filter((response) => {
      let creatorId = this.get('utils').getBelongsToId(response, 'createdBy');
      return !response.get('WasReadByRecipient') && creatorId === this.get('currentUser.id');
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
      // this.set('filteredResponses', this.get('sortedSubmitterResponses'));
    },
    showApprovingResponses() {
      this.set('currentFilter', 'approving');
      // this.set('filteredResponses', this.get('sortedApprovingResponses'));
    },
    showMentoringResponses() {
      this.set('currentFilter', 'mentoring');
      // this.set('filteredResponses', this.get('sortedMentoringResponses'));
    },
    showAllResponses() {
      this.set('currentFilter', 'all');
      // this.set('filteredResponses', this.get('sortedAllResponses'));

    },
    toSubmissionResponse(sub) {
      this.sendAction('toSubmissionResponse', sub.get('id'));
    }
  },

});
