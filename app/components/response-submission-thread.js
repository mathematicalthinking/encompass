Encompass.ResponseSubmissionThreadComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  classNames: ['response-submission-thread'],

  utils: Ember.inject.service('utility-methods'),

  inNeedOfRevisions: Ember.computed.gt('needsRevisionResponses.length', 0),
  waitingForApproval: Ember.computed.gt('pendingApprovalResponses.length', 0),
  isUnfinishedDraft: Ember.computed.gt('draftResponses.length', 0),
  isUnreadReply: Ember.computed.gt('unreadResponses.length', 0),

  isActionNeeded: Ember.computed.not('isNoActionNeeded'),

  statusMap: {
    upToDate: {
      display: 'Up To Date',
      statusFill: '#35A853'
    },
    doesHaveDraft: {
      display: 'Unfinished Draft',
      statusFill: '#778899'
    },
    hasNewRevision: {
      display: 'New Revision',
      statusFill: '#3997EE'
    },
    doesHaveUnmentoredRevision: {
      display: 'Unmentored Revision',
      statusFill: '#3997EE'
    },
    doesHaveUnreadReply: {
      display: 'Unread Reply',
      statusFill: '#3997EE'
    },
    isWaitingForApproval: {
      display: 'Pending Approval',
      statusFill: '#FFD204'
    },
    doesNeedRevisions: {
      display: 'Needs Revisions',
      statusFill: '#EB5757'
    }

  },
  displayStatus: function() {
    let status = this.get('highestPriorityStatus');
    return this.get('statusMap.' + status);
  }.property('highestPriorityStatus'),

  didReceiveAttrs() {

    this.get('thread').forEach((val, key) => {
      this.set(key, val);
    });
    this.resolveMentors();
    this.resolveWorkspace();

    this.resolveStudent().then((student) => {
      this.set('student', student);
    });
    this._super(...arguments);
  },

  resolveStudent() {
    let id = this.get('studentId');
    if (this.get('utils').isValidMongoId(id)) {
      let user = this.get('store').peekRecord('user', id);
      if (user) {
        return Ember.RSVP.resolve(user);
      }
      return Ember.RSVP.resolve(this.get('store').findRecord('user', id));
    }
    // otherwise is old pows user
    let submissions = this.get('submissions');
    if (!submissions) {
      return Ember.RSVP.resolve('unknown');
    }
    return Ember.RSVP.resolve(submissions.get('firstObject.student'));
  },

  resolveWorkspace() {
    let id = this.get('workspaceId');
    if (!id) {
      return Ember.RSVP.resolve(null);
    }

    return this.get('store').findRecord('workspace', id)
      .then((workspace) => {
        if (!this.get('isDestroyed') && !this.get('isDestroying')) {
          this.set('workspace', workspace);
        }
      });
  },

  studentDisplay: function() {
    let student = this.get('student');
    if (typeof student === 'string') {
      return student;
    }
    if (typeof student === 'object') {
      return student.get('username');
    }
  }.property('student'),

  isNoActionNeeded: function() {
    return !this.get('inNeedOfRevisions') && !this.get('waitingForApproval') && !this.get('isUnfinishedDraft') && !this.get('isUnreadReply') && !this.get('isNew');
  }.property('inNeedOfRevisions', 'waitingForApproval', 'isUnfinishedDraft', 'isUnreadReply', 'isNew'),

  mainResponses: function() {
    return this.get('responses') || [];
  }.property('responses.[]'),

  sortedMainResponses: function() {
    return this.get('mainResponses').sortBy('createDate');
  }.property('mainResponses.[]'),

  unreadResponses: function() {
    return this.get('mainResponses').filter((response) => {
      let recipientId = this.get('utils').getBelongsToId(response, 'recipient');
      return !response.get('wasReadByRecipient') && recipientId === this.get('currentUser.id');
    });
  }.property('mainResponses.@each.wasReadByRecipient'),

  unreadCounter: function() {
    let count = this.get('unreadResponses.length');

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }.property('unreadResponses.[]'),

  draftResponses: function() {
    return this.get('mainResponses').filterBy('status', 'draft');
  }.property('mainResponses.@each.status'),

  draftCounter: function() {
    let count = this.get('draftResponses.length');

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }.property('draftResponses.[]'),

  needsRevisionResponses: function() {
    return this.get('mainResponses').filterBy('status', 'needsRevisions');
  }.property('mainResponses.@each.status'),

  needsRevisionCounter: function() {
    let count = this.get('needsRevisionResponses.length');

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }.property('needsRevisionResponses.[]'),

  pendingApprovalResponses: function() {
    return this.get('mainResponses').filterBy('status', 'pendingApproval');
  }.property('mainResponses.@each.status'),

  pendingApprovalCounter: function() {
    let count = this.get('pendingApprovalResponses.length');

    if (count > 1) {
      return `(${count})`;
    }
    return '';
  }.property('pendingApprovalResponses.[]'),

  newestResponse: function() {
    return this.get('thread.latestReply');
  }.property('thread.latestReply'),

  resolveMentors() {
    let mentors = [];

    this.get('mainResponses').forEach((response) => {
      let type = response.get('responseType');
      if (type === 'mentor') {
        mentors.addObject(response.get('createdBy'));
      }
      if (type === 'approver') {
        mentors.addObject(response.get('recipient'));
      }
    });

    return Ember.RSVP.all(mentors)
    .then((users) => {
      if (!this.get('isDestroying') && !this.get('isDestroyed')) {
        this.set('submissionMentors', users.uniqBy('id'));
      }
    });
  },

  highestPriorityStatus: function() {
    if (this.get('doesHaveDraft')) {
      return 'doesHaveDraft';
    }

    if (this.get('hasNewRevision')) {
      return 'hasNewRevision';
    }

    if (this.get('doesHaveUnmentoredRevision')) {
      return 'doesHaveUnmentoredRevision';
    }

    if (this.get('doesHaveUnreadReply')) {
      return 'doesHaveUnreadReply';
    }

    if (this.get('isWaitingForApproval')) {
      return 'isWaitingForApproval';
    }
    if (this.get('doesNeedRevisions')) {
      return 'doesNeedRevisions';
    }

    return 'upToDate';

  }.property('doesHaveDraft', 'doesHaveUnreadReply', 'isWaitingForApproval', 'hasNewRevision', 'dosHaveUnmentoredRevision', 'doesNeedRevisions', 'isWaitingForApproval'),

  actions: {
    toSubmissionResponse: function() {
      if (this.get('highestPriorityStatus') === 'doesHaveUnreadReply') {
        let sortedUnread = this.get('unreadResponses').sortBy('createDate');
        let newestUnread = sortedUnread.get('lastObject');
        let responseId = sortedUnread.get('lastObject.id');
        let submissionId = this.get('utils').getBelongsToId(newestUnread, 'submission');
        this.get('toResponse')(submissionId, responseId);
      }
      this.get('toSubmissionResponse')(this.get('latestRevision'));
    }
  }

});