/* eslint-disable complexity */
Encompass.ResponsesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'responses-list',

  utils: Ember.inject.service('utility-methods'),
  isShowAll: Ember.computed.equal('currentFilter', 'all'),

  showAllFilter: false,

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

  threadsPerPage: 50,

  currentMetadata: function() {
    let filter = this.get('currentFilter');
    if (filter === 'submitter') {
      return this.get('meta.submitter');
    }
    if (filter === 'mentoring') {
      return this.get('meta.mentoring');
    }
    if (filter === 'approving') {
      return this.get('meta.approving');
    }
  }.property('currentFilter', 'meta.{submitter,mentoring,approving}'),

  allThreads: function() {
    return this.get('threads');
  }.property('threads.[]'),

  mentoringThreads: function() {
    return this.get('allThreads').filterBy('threadType', 'mentor');
  }.property('allThreads.[]'),

  approvingThreads: function() {
    return this.get('allThreads').filterBy('threadType', 'approver');
  }.property('allThreads.[]'),

  submitterThreads: function() {
    return this.get('allThreads').filterBy('threadType', 'submitter');
  }.property('allThreads.[]'),

  actionSubmitterThreads: function() {
    return this.get('submitterThreads').filterBy('isActionNeeded');
  }.property('submitterThreads.@each.isActionNeeded'),

  actionMentoringThreads: function() {
    return this.get('mentoringThreads').filterBy('isActionNeeded');
  }.property('mentoringThreads.@each.isActionNeeded'),

  actionApprovingThreads: function() {
    return this.get('approvingThreads').filterBy('isActionNeeded');
  }.property('approvingThreads.@each.isActionNeeded'),

  sortedApprovingThreads: function() {
    return this.get('approvingThreads')
    .sort((a, b) => {
      let aPriority = a.get('sortPriority');
      let bPriority = b.get('sortPriority');

      if (aPriority === bPriority) {
        let aDate = moment(a.get('latestReply.createDate'));
        let bDate = moment(b.get('latestReply.createDate'));

        return bDate - aDate;
      }

      return bPriority - aPriority;

    });
  }.property('approvingThreads.@each.{sortPriority,latestReply}'),

  sortedSubmitterThreads: function() {
    return this.get('submitterThreads').sort((a,b)=> {
      let aPriority = a.get('sortPriority');
      let bPriority = b.get('sortPriority');

      if (aPriority === bPriority) {
        let aDate = moment(a.get('latestReply.createDate'));
        let bDate = moment(b.get('latestReply.createDate'));

        if (aDate === bDate) {
          aDate = moment(a.get('latestRevision.createDate'));
          bDate = moment(b.get('latestRevision.createDate'));
        }
        return bDate - aDate;
      }

      return bPriority - aPriority;

    });
  }.property('submitterThreads.@each.{sortPriority,latestReply,latestRevision}'),

  sortedMentoringThreads: function() {
    return this.get('mentoringThreads').sort((a,b)=> {
      let aPriority = a.get('sortPriority');
      let bPriority = b.get('sortPriority');
      if (aPriority === bPriority) {
        let aDate = moment(a.get('latestReply.createDate'));
        let bDate = moment(b.get('latestReply.createDate'));
        if ((!aDate && !bDate) || aDate === bDate) {
          aDate = moment(a.get('latestRevision.createDate'));
          bDate = moment(b.get('latestRevision.createDate'));
        }
        return bDate - aDate;
      }

      return bPriority - aPriority;

    });
  }.property('mentoringThreads.@each.{sortPriority,latestReply,latestRevision}'),

  areThreads: Ember.computed.gt('allThreads.length', 0),

  isAdmin: function() {
    return this.get('currentUser.isAdmin') && !this.get('currentUser.isStudent');
  },

  didReceiveAttrs() {
    this.set('storeThreads', this.get('store').peekAll('response-thread'));
    let list = [
      {name: 'submitterResponses', actionCount : this.get('actionSubmitterThreads.length'), allCount: this.get('submitterThreads.length'), currentFilter: 'submitter'},
      {name: 'mentoringResponses', actionCount: this.get('actionMentoringThreads.length'), allCount: this.get('mentoringThreads.length'), currentFilter: 'mentoring'},
      {name: 'approvingResponses', actionCount: this.get('actionApprovingThreads.length'), allCount: this.get('approvingThreads.length'), currentFilter: 'approving'}
    ];

    // ascending
    let sorted = list.sortBy('actionCount', 'allCount');

    this.set('currentFilter', sorted[2].currentFilter);

    this._super(...arguments);
  },


  showMentorHeader: function() {
    return this.get('currentFilter') !== 'mentoring';
  }.property('currentFilter'),

  showStudentHeader: function() {
    return this.get('currentFilter') !== 'submitter';
  }.property('currentFilter'),




  fetchThreads(threadType, page, limit=this.get('threadsPerPage')) {
    return this.get('store').query('responseThread', {
      threadType,
      page,
      limit
    })
    .then((results) => {
      let meta = results.get('meta.meta');
      this.set('threads', results.toArray());
      this.set('meta', meta);
      if (this.get('isLoadingNewPage')) {
        this.set('isLoadingNewPage', false);
      }
      console.log('result threads meta', meta);
    });
  },

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
      return this.get('allThreads');
    }
  }.property('currentFilter', 'sortedSubmitterThreads.[]', 'sortedMentoringThreads.[],', 'sortedApprovingThreads.[]'),

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

  showStatusColumn: function() {
    return this.get('currentFilter') === 'mentoring' || this.get('currentFilter') === 'approving' || this.get('currentFilter') === 'all';
  }.property('currentFilter'),

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
    toResponse(submissionId, responseId) {
      this.sendAction('toResponse', submissionId, responseId);
    },
    refreshList() {
      this.fetchThreads('all', 1);
    },

    initiatePageChange(page) {
      let currentFilter = this.get('currentFilter');
      let threadType;

      if (currentFilter === 'submitter') {
        threadType = 'submitter';
      }
      if (currentFilter === 'mentoring') {
        threadType = 'mentor';
      }
      if (currentFilter === 'approving') {
        threadType = 'approver';
      }

      this.set('isLoadingNewPage', true);
      this.fetchThreads(threadType, page);
    }
  }
});
