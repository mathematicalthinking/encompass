import Component from '@ember/component';
import { computed } from '@ember/object';
/* eslint-disable complexity */
import { equal, gt } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import moment from 'moment';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  elementId: 'responses-list',

  utils: service('utility-methods'),
  isShowAll: equal('currentFilter', 'all'),

  showAllFilter: false,

  isShowSubmitter: equal('currentFilter', 'submitter'),
  isShowMentoring: equal('currentFilter', 'mentoring'),
  isShowApproving: equal('currentFilter', 'approving'),

  showSubmitterTab: gt('submitterThreads.length', 0),
  showMentoringTab: gt('mentoringThreads.length', 0),
  showApprovingTab: gt('approvingThreads.length', 0),

  currentFilter: 'submitter',
  sortParam: 'newest',

  noResponsesMessage: 'No responses found',

  showStudentColumn: equal('isShowMentoring', true),

  statusMap: {
    approved: 'APPROVED',
    pendingApproval: 'PENDING APPROVAL',
    needsRevisions: 'NEEDS REVISIONS',
    superceded: 'SUPERCEDED',
  },

  threadsPerPage: 50,

  didReceiveAttrs() {
    this.set('storeThreads', this.store.peekAll('response-thread'));

    let list = [
      {
        name: 'submitterResponses',
        actionCount: this.actionSubmitterThreads.length,
        allCount: this.submitterThreads.length,
        currentFilter: 'submitter',
      },
      {
        name: 'mentoringResponses',
        actionCount: this.actionMentoringThreads.length,
        allCount: this.mentoringThreads.length,
        currentFilter: 'mentoring',
      },
      {
        name: 'approvingResponses',
        actionCount: this.actionApprovingThreads.length,
        allCount: this.approvingThreads.length,
        currentFilter: 'approving',
      },
    ];

    // ascending
    let sorted = list.sortBy('actionCount', 'allCount');

    this.set('currentFilter', sorted[2].currentFilter);

    this._super(...arguments);
  },

  currentMetadata: computed(
    'currentFilter',
    'meta.{submitter,mentoring,approving}',
    function () {
      let filter = this.currentFilter;
      if (filter === 'submitter') {
        return this.meta.submitter;
      }
      if (filter === 'mentoring') {
        return this.meta.mentoring;
      }
      if (filter === 'approving') {
        return this.meta.approving;
      }
    }
  ),

  newThreads: computed('storeThreads.[]', function () {
    return this.storeThreads.filterBy('isNewThread');
  }),

  allThreads: computed(
    'threads.@each.isTrashed',
    'newThreads.@each.isTrashed',
    function () {
      let newThreads = this.newThreads || [];
      let threads = this.threads;
      newThreads.forEach((thread) => {
        threads.addObject(thread);
      });
      return threads.rejectBy('isTrashed');
    }
  ),

  mentoringThreads: computed('allThreads.[]', function () {
    return this.allThreads.filterBy('threadType', 'mentor');
  }),

  approvingThreads: computed('allThreads.[]', function () {
    return this.allThreads.filterBy('threadType', 'approver');
  }),

  submitterThreads: computed('allThreads.[]', function () {
    return this.allThreads.filterBy('threadType', 'submitter');
  }),

  actionSubmitterThreads: computed(
    'submitterThreads.@each.isActionNeeded',
    function () {
      return this.submitterThreads.filterBy('isActionNeeded');
    }
  ),

  actionMentoringThreads: computed(
    'mentoringThreads.@each.isActionNeeded',
    function () {
      return this.mentoringThreads.filterBy('isActionNeeded');
    }
  ),

  actionApprovingThreads: computed(
    'approvingThreads.@each.isActionNeeded',
    function () {
      return this.approvingThreads.filterBy('isActionNeeded');
    }
  ),

  sortedApprovingThreads: computed(
    'approvingThreads.@each.{sortPriority,latestReply}',
    function () {
      return this.approvingThreads.sort((a, b) => {
        let aPriority = a.get('sortPriority');
        let bPriority = b.get('sortPriority');

        if (aPriority === bPriority) {
          let aDate = moment(a.get('latestReply.createDate'));
          let bDate = moment(b.get('latestReply.createDate'));

          return bDate - aDate;
        }

        return bPriority - aPriority;
      });
    }
  ),

  sortedSubmitterThreads: computed(
    'submitterThreads.@each.{sortPriority,latestReply,latestRevision}',
    function () {
      return this.submitterThreads.sort((a, b) => {
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
    }
  ),

  sortedMentoringThreads: computed(
    'mentoringThreads.@each.{sortPriority,latestReply,latestRevision}',
    function () {
      return this.mentoringThreads.sort((a, b) => {
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
    }
  ),

  areThreads: gt('allThreads.length', 0),

  isAdmin: () => this.currentUser.isAdmin && !this.currentUser.isStudent,

  showMentorHeader: computed('currentFilter', function () {
    return this.currentFilter !== 'mentoring';
  }),

  showStudentHeader: computed('currentFilter', function () {
    return this.currentFilter !== 'submitter';
  }),

  fetchThreads(threadType, page, limit = this.threadsPerPage) {
    return this.store
      .query('responseThread', {
        threadType,
        page,
        limit,
      })
      .then((results) => {
        let meta = results.get('meta.meta');
        this.set('threads', results.toArray());
        this.set('meta', meta);
        if (this.isLoadingNewPage) {
          this.set('isLoadingNewPage', false);
        }
      });
  },

  submitterThreadsCount: computed('submitterThreads.[]', function () {
    return this.submitterThreads.length;
  }),

  mentoringThreadsCount: computed('mentoringThreads.[]', function () {
    return this.mentoringThreads.length;
  }),

  approvingThreadsCount: computed('approvingThreads.[]', function () {
    return this.approvingThreads.length;
  }),

  displayThreads: computed(
    'currentFilter',
    'allThreads.[]',
    'sortedSubmitterThreads.[]',
    'sortedMentoringThreads.[],',
    'sortedApprovingThreads.[]',
    function () {
      let val = this.currentFilter;

      if (!this.areThreads) {
        return [];
      }

      let submitterCount = this.submitterThreadsCount;
      let mentoringCount = this.mentoringThreadsCount;
      let approvingCount = this.approvingThreadsCount;

      if (val === 'submitter') {
        if (submitterCount > 0) {
          return this.sortedSubmitterThreads;
        }

        return mentoringCount >= approvingCount
          ? this.sortedMentoringThreads
          : this.sortedApprovingThreads;
      }
      if (val === 'mentoring') {
        if (mentoringCount > 0) {
          return this.sortedMentoringThreads;
        }

        return approvingCount >= submitterCount
          ? this.sortedApprovingThreads
          : this.sortedSubmitterThreads;
      }

      if (val === 'approving') {
        if (approvingCount > 0) {
          return this.sortedApprovingThreads;
        }
        return mentoringCount >= submitterCount
          ? this.sortedMentoringThreads
          : this.sortedSubmitterThreads;
      }

      if (val === 'all') {
        return this.allThreads;
      }
    }
  ),

  submitterCounter: computed('actionSubmitterThreads.[]', function () {
    let count = this.actionSubmitterThreads.length;

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }),

  mentoringCounter: computed('actionMentoringThreads.[]', function () {
    let count = this.actionMentoringThreads.length;

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }),

  approvingCounter: computed('actionApprovingThreads.[]', function () {
    let count = this.actionApprovingThreads.length;

    if (count > 0) {
      return `(${count})`;
    }
    return '';
  }),

  showStatusColumn: computed('currentFilter', function () {
    return (
      this.currentFilter === 'mentoring' ||
      this.currentFilter === 'approving' ||
      this.currentFilter === 'all'
    );
  }),

  doesHaveUnreadReply(responses) {
    if (!responses) {
      return false;
    }
    let unreadReply = responses.find((response) => {
      let recipientId = this.utils.getBelongsToId(response, 'recipient');
      return (
        !response.get('wasReadByRecipient') &&
        recipientId === this.currentUser.id
      );
    });
    return !this.utils.isNullOrUndefined(unreadReply);
  },

  areUnreadNotesOnly(responses) {
    if (!responses) {
      return false;
    }
    let unreadReplies = responses.filter((response) => {
      let creatorId = this.utils.getBelongsToId(response, 'createdBy');
      return (
        !response.get('wasReadByRecipient') && creatorId === this.currentUser.id
      );
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
    return !this.utils.isNullOrUndefined(reply);
  },

  isWaitingForApproval(responses) {
    if (!responses) {
      return false;
    }
    let reply = responses.find((response) => {
      return response.get('status') === 'pendingApproval';
    });
    return !this.utils.isNullOrUndefined(reply);
  },

  doesHaveDraft(responses) {
    if (!responses) {
      return false;
    }
    let reply = responses.find((response) => {
      return response.get('status') === 'draft';
    });
    return !this.utils.isNullOrUndefined(reply);
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
      let currentFilter = this.currentFilter;
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
    },
  },
});
