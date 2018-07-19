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
  firstThread: Ember.computed.alias('submissionThreadHeads.firstObject'),
  lastThread: Ember.computed.alias('submissionThreadHeads.lastObject'),
  manyRevisions: Ember.computed.gte('currentRevisions.length', 10),
  showStudents: false,

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

  currentThread: function() {
    console.log('calculating currentThread');
    return this.get('submissionThreads')
      .get( this.get('currentStudent') );
  }.property('submission'),

  prevThread: function() {
    console.log('calculating prevThread');
    var thread = this.get('currentThread.lastObject');

    if(thread === this.get('firstThread')) {
      return this.get('lastThread');
    }

    var prevIndex = this.get('submissionThreadHeads').indexOf(thread) - 1;
    console.log('prevIndex', prevIndex);

    var prev = this.get('submissionThreadHeads').objectAt(prevIndex);
    console.log('prev', prev);

    return prev;
  }.property('currentThread', 'firstThread'),

  nextThread: function() {
    console.log('calculating nextThread');
    var thread = this.get('currentThread.lastObject');

    if(thread === this.get('lastThread')) {
      return this.get('firstThread');
    }

    var nextIndex = this.get('submissionThreadHeads').indexOf(thread) + 1;
    var next = this.get('submissionThreadHeads').objectAt(nextIndex);

    return next;
  }.property('submission', 'currentThread', 'lastThread'),

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

  currentSubmissionIndex: function() {
    return this.submissions.sortBy('student').indexOf(this.submission) + 1;
  }.property('submissionThreads.[]', 'submission'),

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

