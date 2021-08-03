import Component from '@ember/component';
// import EmberMap from '@ember/map';
import { computed, observer } from '@ember/object';
import { alias, equal, gte, or, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
/**
 * Passed in by template:
 * - submissions
 * - submission
 * - canSelect - only used to pass on to submissions
 * - currentUser - only used to pass on to submissions
 * - currentWorkspace - only used to pass on to submissions
 */
import { isEqual } from '@ember/utils';
import $ from 'jquery';
import moment from 'moment';

export default Component.extend({
  elementId: 'submission-group',
  utils: service('utility-methods'),
  classNameBindings: [
    'makingSelection:al_makeselect',
    'isHidden:hidden',
    'isFirstChild:is-first-child',
    'isLastChild:is-last-child',
    'isOnlyChild',
    'isBipaneled:bi-paneled',
    'isTripaneled:tri-paneled',
    'isNavMultiLine:multi-line-nav',
  ],
  classNames: ['workspace-flex-item', 'submission'],
  isHidden: false,

  currentStudent: alias('submission.student'),
  currentStudentDisplayName: alias('submission.studentDisplayName'),
  firstThread: alias('submissionThreadHeads.firstObject'),
  lastThread: alias('submissionThreadHeads.lastObject'),
  manyRevisions: gte('currentRevisions.length', 10),
  showStudents: false,
  switching: false,

  init() {
    this.set('onNavResize', this.handleNavHeight.bind(this));
    this._super(...arguments);
  },

  didInsertElement() {
    let revisionsNavHeight = this.$('#submission-nav').height();
    this.set('isNavMultiLine', revisionsNavHeight > 52);

    $(window).on('resize', this.onNavResize);
  },

  didUpdateAttrs() {
    let studentSelectize = this.$('#student-select')[0];
    if (studentSelectize) {
      let currentValue = studentSelectize.selectize.getValue();

      let currentSubmissionId = this.initialStudentItem.firstObject;
      if (this.initialStudentItem.firstObject !== currentValue) {
        studentSelectize.selectize.setValue([currentSubmissionId], true);
      }
    }
  },

  willDestroyElement() {
    $(window).off('resize', this.onNavResize);
  },

  currentRevision: computed(
    'currentRevisions.[]',
    'currentRevisionIndex',
    function () {
      if (!this.currentRevisions || !this.currentRevisionIndex) {
        return null;
      }
      return this.currentRevisions.objectAt(this.currentRevisionIndex - 1);
    }
  ),

  //TODO Use the new thread.threadId property on submissions
  submissionThreads: computed('submissions.[]', function () {
    let threads = {};
    console.log(threads);
    this.submissions
      .sortBy('student')
      .getEach('student')
      .uniq()
      .forEach((student) => {
        if (!threads[student]) {
          const answers = this.studentWork(student);
          threads[student] = answers;
        }
      });
    return threads;
  }),

  studentWork: function (student) {
    return this.submissions.filterBy('student', student).sortBy('createDate');
  },

  submissionThreadHeads: computed('submissionThreads.[]', function () {
    var pointers = [];
    var threads = this.submissionThreads;

    Object.keys(threads).forEach(function (student) {
      pointers.pushObject(threads[student].get('lastObject'));
    });

    return pointers;
  }),

  currentRevisions: computed('currentThread', function () {
    var dateTime = 'l h:mm';
    var thread = this.currentThread;
    var revisions = [];

    if (thread) {
      revisions = thread.map(function (submission, index, thread) {
        return {
          index: index + 1, // Because arrays are zero-indexed
          label: moment(submission.get('createDate')).format(dateTime),
          revision: submission,
          thread: thread.get('lastObject'),
        };
      });
    }
    return revisions;
  }),

  currentThread: computed('submission', function () {
    return this.submissionThreads[this.currentStudent];
  }),

  prevThread: computed('currentThread', 'firstThread', function () {
    const currentThread = this.currentThread;
    const ix = currentThread.indexOf(this.submission);
    if (currentThread.length > 1) {
      if (!isEqual(this.submission, currentThread[currentThread.length - 1])) {
        return currentThread[ix + 1];
      }
    }

    var thread = this.currentThread.lastObject;
    if (thread === this.firstThread) {
      return this.lastThread;
    }
    var prevIndex = this.submissionThreadHeads.indexOf(thread) - 1;
    var prev = this.submissionThreadHeads.objectAt(prevIndex);
    return prev;
  }),

  nextThread: computed(
    'submission',
    'currentThread',
    'lastThread',
    function () {
      const currentThread = this.currentThread;
      const ix = currentThread.indexOf(this.submission);
      if (currentThread.length > 1) {
        if (!isEqual(this.submission, currentThread[0])) {
          return currentThread[ix - 1];
        }
      }
      var thread = this.currentThread.lastObject;

      if (thread === this.lastThread) {
        return this.firstThread;
      }

      var nextIndex = this.submissionThreadHeads.indexOf(thread) + 1;
      var next = this.submissionThreadHeads.objectAt(nextIndex);

      return next;
    }
  ),

  currentRevisionIndex: computed('submission', function () {
    const revisions = this.currentRevisions;
    if (!revisions || revisions.get('length') === 0) {
      return 0;
    }
    const currentSubmissionId = this.submission.id;
    if (revisions.length === 1) {
      return 1;
    }

    return revisions
      .filter((rev) => {
        return isEqual(rev.revision.id, currentSubmissionId);
      })
      .objectAt(0).index;
  }),

  sortCriteria: ['student', 'createDate:desc'],
  sortedSubmissions: sort('submissions', 'sortCriteria'),

  currentSubmissionIndex: computed(
    'submissionThreads.[]',
    'submission',
    function () {
      return this.sortedSubmissions.indexOf(this.submission) + 1;
    }
  ),

  modelChanged: observer('submission', function () {
    this.set('switching', true);
  }),

  mentoredRevisions: computed(
    'responses.[]',
    'currentRevisions.@each.submission',
    function () {
      return this.currentRevisions.filter((revisionObj) => {
        let sub = revisionObj.revision;

        let responseIds = this.utils.getHasManyIds(sub, 'responses');

        return this.responses.find((response) => {
          return responseIds.includes(response.get('id'));
        });
      });
    }
  ),

  revisionsToolTip:
    'Revisions are sorted from oldest to newest, left to right. Star indicates that a revision has been mentored (or you have saved a draft)',

  isFirstChild: computed('containerLayoutClass', function () {
    let classname = this.containerLayoutClass;
    return classname === 'hsc';
  }),

  isLastChild: computed('containerLayoutClass', function () {
    let classname = this.containerLayoutClass;
    return classname === 'fsh';
  }),

  isOnlyChild: computed('containerLayoutClass', function () {
    let classname = this.containerLayoutClass;
    return classname === 'hsh';
  }),

  isBipaneled: or('isFirstChild', 'isLastChild'),
  isTripaneled: equal('containerLayoutClass', 'fsc'),

  handleNavHeight() {
    let height = this.$('#submission-nav').height();

    let ownHeight = this.$().height();
    this.set('ownHeight', ownHeight);

    let isNowMultiLine = height > 52;
    let wasMultiLine = this.isNavMultiLine;

    if (isNowMultiLine !== wasMultiLine) {
      this.set('isNavMultiLine', isNowMultiLine);
    }
  },
  studentSelectOptions: computed('submissionThreadHeads', function () {
    return this.submissionThreadHeads.map((sub) => {
      return {
        name: sub.get('studentDisplayName'),
        id: sub.get('id'),
      };
    });
  }),
  initialStudentItem: computed(
    'submission',
    'submissionThreadHeads.[]',
    function () {
      let currentStudent = this.submission.student;
      let threadHead = this.submissionThreadHeads.findBy(
        'student',
        currentStudent
      );
      return [threadHead.get('id')];
    }
  ),

  actions: {
    toggleStudentList: function () {
      this.set('showStudents', !this.showStudents);
    },

    /**
     * This action will be sent to this component from the workspace-submission component.
     */
    addSelection: function (selection, isUpdateOnly) {
      this.sendAction('addSelection', selection, isUpdateOnly);
    },

    /**
     * This action will be sent to this component from the workspace-submission component.
     */
    deleteSelection: function (selection) {
      this.sendAction('deleteSelection', selection);
    },
    toNewResponse(subId, wsId) {
      this.toNewResponse(subId, wsId);
    },
    setCurrentSubmission(currentRevision) {
      if (!currentRevision) {
        return;
      }
      let submission = currentRevision.revision;
      if (!submission) {
        return;
      }
      this.toSubmission(submission);
    },
    onStudentSelect(submissionId) {
      let submission = this.submissionThreadHeads.findBy('id', submissionId);
      this.toSubmission(submission);
    },

    onStudentBlur() {
      let studentSelectize = this.$('#student-select')[0];

      if (studentSelectize) {
        let currentValue = studentSelectize.selectize.getValue();

        let currentSubmissionId = this.initialStudentItem.firstObject;
        if (this.initialStudentItem.firstObject !== currentValue) {
          studentSelectize.selectize.setValue([currentSubmissionId], true);
        }
      }
    },
  },
});
