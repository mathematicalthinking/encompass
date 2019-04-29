/**
 * Passed in by template:
 * - submissions
 * - submission
 * - canSelect - only used to pass on to submissions
 * - currentUser - only used to pass on to submissions
 * - currentWorkspace - only used to pass on to submissions
 */
Encompass.SubmissionGroupComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'submission-group',

  classNameBindings: ['makingSelection:al_makeselect', 'isHidden:hidden', 'isFirstChild:is-first-child', 'isLastChild:is-last-child', 'isOnlyChild', 'isBipaneled:bi-paneled', 'isTripaneled:tri-paneled', 'isNavMultiLine:multi-line-nav'],
  classNames: ['workspace-flex-item', 'submission'],
  isHidden: false,

  currentStudent: Ember.computed.alias('submission.student'),
  currentStudentDisplayName: Ember.computed.alias('submission.studentDisplayName'),
  firstThread: Ember.computed.alias('submissionThreadHeads.firstObject'),
  lastThread: Ember.computed.alias('submissionThreadHeads.lastObject'),
  manyRevisions: Ember.computed.gte('currentRevisions.length', 10),
  showStudents: false,
  switching: false,

  init() {
    this.set('onNavResize', this.get('handleNavHeight').bind(this));
    this._super(...arguments);
  },

  didInsertElement() {
    let revisionsNavHeight = this.$('#submission-nav').height();
    this.set('isNavMultiLine', revisionsNavHeight > 52);

    $(window).on('resize', this.get('onNavResize'));

  },

  didUpdateAttrs() {
    let studentSelectize = this.$('#student-select')[0];
    if (studentSelectize) {
      let currentValue = studentSelectize.selectize.getValue();

      let currentSubmissionId = this.get('initialStudentItem.firstObject');
      if (this.get('initialStudentItem.firstObject') !== currentValue) {
        studentSelectize.selectize.setValue([currentSubmissionId], true);
      }
    }
  },

  willDestroyElement() {
    $(window).off('resize', this.get('onNavResize'));
  },

  currentRevision: function() {
    if (!this.get('currentRevisions') || !this.get('currentRevisionIndex')) {
      return null;
    }
    return this.get('currentRevisions').objectAt(this.get('currentRevisionIndex') - 1);
  }.property('currentRevisions.[]', 'currentRevisionIndex'),

  //TODO Use the new thread.threadId property on submissions
  submissionThreads: function() {
    let threads = Ember.Map.create();

    let sortedSubs = this.get('submissions').sortBy('student');

    sortedSubs.forEach((sub) => {
      let student = sub.get('student');

      let thread = threads.get(student);

      if (!thread) {
        threads.set(student, this.studentWork(student));
      }
    });

    return threads;
  }.property('submissions.[]'),

  studentWork: function(student) {
    return this.get('submissions')
      .filterBy('student', student)
      .sortBy('createDate');
  },

  submissionThreadHeads: function() {
    var pointers = [];
    var threads = this.get('submissionThreads');

    threads.forEach(function(submissions, student) {
      pointers.pushObject( submissions.get('lastObject') );
    });

    return pointers;
  }.property('submissionThreads.[]'),

  currentRevisions: function() {
    var dateTime  = 'l h:mm';
    var thread    = this.get('currentThread');
    var revisions = [];

    if(thread) {
      revisions = thread.map(function(submission, index, thread) {
        return {
          index: index+1, // Because arrays are zero-indexed
          label: moment(submission.get('createDate')).format(dateTime),
          revision: submission,
          thread: thread.get('lastObject')
        };
      });
    }
    return revisions;
  }.property('currentThread'),

  currentThread: function() {
    return this.get('submissionThreads')
      .get( this.get('currentStudent') );
  }.property('submission'),

  prevThread: function() {
    const currentThread = this.get('currentThread');
    const ix = currentThread.indexOf(this.submission);
    if (currentThread.length > 1) {
      if (!Ember.isEqual(this.submission, currentThread[currentThread.length - 1])) {
        return currentThread[ix + 1];
      }
    }

    var thread = this.get('currentThread.lastObject');
    if(thread === this.get('firstThread')) {
      return this.get('lastThread');
    }
     var prevIndex = this.get('submissionThreadHeads').indexOf(thread) - 1;
     var prev = this.get('submissionThreadHeads').objectAt(prevIndex);
    return prev;
  }.property('currentThread', 'firstThread'),

  nextThread: function() {
    const currentThread = this.get('currentThread');
    const ix = currentThread.indexOf(this.submission);
    if (currentThread.length > 1) {
      if (!Ember.isEqual(this.submission, currentThread[0])) {
        return currentThread[ix - 1];
      }
    }
    var thread = this.get('currentThread.lastObject');

    if(thread === this.get('lastThread')) {
      return this.get('firstThread');
    }

    var nextIndex = this.get('submissionThreadHeads').indexOf(thread) + 1;
    var next = this.get('submissionThreadHeads').objectAt(nextIndex);

    return next;
  }.property('submission', 'currentThread', 'lastThread'),

  currentRevisionIndex: function() {
    const revisions = this.get('currentRevisions');
    if (!revisions || revisions.get('length') === 0) {
      return 0;
    }
    const currentSubmissionId = this.get('submission.id');
    if (revisions.length === 1) {
      return 1;
    }

    return revisions.filter((rev) => {
      return Ember.isEqual(rev.revision.id, currentSubmissionId);
      }).objectAt(0).index;
  }.property('submission'),

  sortCriteria: ['student', 'createDate:desc'],
  sortedSubmissions: Ember.computed.sort('submissions', 'sortCriteria'),

  currentSubmissionIndex: function() {
    return this.get('sortedSubmissions').indexOf(this.submission) + 1;
  }.property('submissionThreads.[]', 'submission'),

  modelChanged: function() {
    this.set('switching', true);
  }.observes('submission'),

  mentoredRevisions: function() {
    return this.get('currentRevisions').filter((revisionObj) => {
      let sub = revisionObj.revision;

      let responseIds = this.get('utils').getHasManyIds(sub, 'responses');

      return this.get('responses').find((response) => {
        return responseIds.includes(response.get('id'));
      });
    });
  }.property('responses.[]', 'currentRevisions.@each.submission'),

  revisionsToolTip: 'Revisions are sorted from oldest to newest, left to right. Star indicates that a revision has been mentored (or you have saved a draft)',

  isFirstChild: function() {
    let classname = this.get('containerLayoutClass');
    return classname === 'hsc';
  }.property('containerLayoutClass'),

  isLastChild: function() {
    let classname = this.get('containerLayoutClass');
    return classname === 'fsh';
  }.property('containerLayoutClass'),

  isOnlyChild: function() {
    let classname = this.get('containerLayoutClass');
    return classname === 'hsh';
  }.property('containerLayoutClass'),

  isBipaneled: Ember.computed.or('isFirstChild', 'isLastChild'),
  isTripaneled: Ember.computed.equal('containerLayoutClass', 'fsc'),

  handleNavHeight() {
    let height = this.$('#submission-nav').height();

    let isNowMultiLine = height > 52;
    let wasMultiLine = this.get('isNavMultiLine');

    if (isNowMultiLine !== wasMultiLine) {
      this.set('isNavMultiLine', isNowMultiLine);
    }
  },
  studentSelectOptions: function() {
    return this.get('submissionThreadHeads').map((sub) => {
      return {
        name: sub.get('studentDisplayName'),
        id: sub.get('id'),
      };
    });
  }.property('submissionThreadHeads'),
  initialStudentItem: function() {
    let currentStudent = this.get('submission.student');
    let threadHead = this.get('submissionThreadHeads').findBy('student', currentStudent);
    return [threadHead.get('id')];
  }.property('submission', 'submissionThreadHeads.[]'),

  actions: {
    toggleStudentList: function() {
      this.set('showStudents', !this.get('showStudents'));
    },

    /**
     * This action will be sent to this component from the workspace-submission component.
     */
    addSelection: function( selection, isUpdateOnly ){
      this.sendAction( 'addSelection', selection, isUpdateOnly );
    },

    /**
     * This action will be sent to this component from the workspace-submission component.
     */
    deleteSelection: function( selection ){
      this.sendAction( 'deleteSelection', selection );
    },
    toNewResponse(subId, wsId) {
      this.get('toNewResponse')(subId, wsId);
    },
    setCurrentSubmission(currentRevision) {
      if (!currentRevision) {
        return;
      }
      let submission = currentRevision.revision;
      if (!submission) {
        return;
      }
      this.get('toSubmission')(submission);
    },
    onStudentSelect(submissionId) {
      let submission = this.get('submissionThreadHeads').findBy('id', submissionId);
      this.get('toSubmission')(submission);
    }
  }
});

