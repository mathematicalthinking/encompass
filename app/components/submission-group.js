/**
 * Passed in by template:
 * - submissions
 * - submission
 * - canSelect - only used to pass on to submissions
 * - currentUser - only used to pass on to submissions
 * - currentWorkspace - only used to pass on to submissions
 */
Encompass.SubmissionGroupComponent = Ember.Component.extend({
  currentStudent: Ember.computed.alias('submission.student'),
  currentStudentDisplayName: Ember.computed.alias('submission.studentDisplayName'),
  firstThread: Ember.computed.alias('submissionThreadHeads.firstObject'),
  lastThread: Ember.computed.alias('submissionThreadHeads.lastObject'),
  manyRevisions: Ember.computed.gte('currentRevisions.length', 10),
  showStudents: false,
  switching: false,

  //TODO Use the new thread.threadId property on submissions
  submissionThreads: function() {
    var threads = Ember.Map.create();
    var comp = this;

    this.submissions.get('content')
      .sortBy('student')
      .getEach('student')
      .uniq()
      .forEach(function(student) {
        if(!threads.has(student)) {
          var submissions = comp.studentWork(student);
          /*
          var thread = {
            id: submissions.get('lastObject.threadId'),
            head: submissions.get('lastObject'),
            student: student,
            revisions: submissions,
          };*/

          threads.set(student, submissions);
        }
      });

    return threads;
  }.property('submissions.[]'),

  studentWork: function(student) {
    var submissions = this.get('submissions')
                    .filterBy('student', student)
                    .sortBy('createDate');

    return submissions;
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
    const currentSubmissionId = this.get('submission').id;
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

  actions: {
    toggleStudentList: function() {
      this.set('showStudents', !this.get('showStudents'));
    },

    /**
     * This action will be sent to this component from the workspace-submission component.
     */
    addSelection: function( selection ){
      console.log("Submission-group sending add action up...");
      this.sendAction( 'addSelection', selection );
    },

    /**
     * This action will be sent to this component from the workspace-submission component.
     */
    deleteSelection: function( selection ){
      console.log("Submission-group sending delete action up...");
      this.sendAction( 'deleteSelection', selection );
    },
  }
});

