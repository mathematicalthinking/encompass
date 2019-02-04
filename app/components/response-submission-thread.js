Encompass.ResponseSubmissionThreadComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  classNames: ['response-submission-thread'],

  utils: Ember.inject.service('utility-methods'),

  inNeedOfRevisions: Ember.computed.gt('needsRevisionResponses.length', 0),
  waitingForApproval: Ember.computed.gt('pendingApprovalResponses.length', 0),
  isUnfinishedDraft: Ember.computed.gt('draftResponses.length', 0),
  isUnreadReply: Ember.computed.gt('unreadResponses.length', 0),

  isActionNeeded: Ember.computed.not('isNoActionNeeded'),

  didReceiveAttrs() {
    this.resolveMentors();
    this._super(...arguments);
  },

  isNoActionNeeded: function() {
    return !this.get('inNeedOfRevisions') && !this.get('waitingForApproval') && !this.get('isUnfinishedDraft') && !this.get('isUnreadReply') && !this.get('isNew');
  }.property('inNeedOfRevisions', 'waitingForApproval', 'isUnfinishedDraft', 'isUnreadReply', 'isNew'),

  mainResponses: function() {
    let type = this.get('threadType');
    if (type === 'submitter') {
      return this.get('submitterResponses');
    }
    if (type === 'mentoring') {
      return this.get('mentoringResponses');
    }

    if (type === 'approving') {
      return this.get('approvingResponses');
    }

    if (type === 'all') {
      return this.get('responses');
    }
    return [];
  }.property('threadType'),

  sortedMainResponses: function() {
    return this.get('mainResponses').sortBy('createDate');
  }.property('mainResponses.[]'),

  toMeResponses: function() {

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
    return this.get('sortedMainResponses.lastObject');
  }.property('sortedMainResponses.[]'),

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

  actions: {
    toSubmissionResponse: function() {
      this.get('toSubmissionResponse')(this.get('submission'));
    }
  }

});