'use strict';

/**
  * # Workspace Submissions Controller
  * @description The controller for interacting with submissions in a workspace
  *              This is used to set the dependency on the workspace controller and add and delete
  *              selections 
  * @author Amir Tahvildaran <amir@mathforum.org>, Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.1
*/
Encompass.WorkspaceSubmissionsController = Ember.Controller.extend({
  workspace: Ember.inject.controller(),
  comments: Ember.inject.controller(),
  workspaceSubmission: Ember.inject.controller(),

  sortProperties: ['student', 'createDate'],
  manyRevisions: Ember.computed.gte('currentRevisions.length', 10),
  showStudents: false,

  firstSubmission: Ember.computed.alias('recentSubmissions.firstObject'),
  firstThread: Ember.computed.alias('submissionThreadHeads.firstObject'),
  currentSubmission: Ember.computed.alias('workspaceSubmission.model'),
  currentStudent: Ember.computed.alias('currentSubmission.student'),
  lastSubmission: Ember.computed.alias('recentSubmissions.lastObject'),
  lastThread: Ember.computed.alias('submissionThreadHeads.lastObject'),
  currentSelection: Ember.computed.oneWay('workspace.selections.firstObject'),

  //TODO Use the new thread.threadId property on submissions
  submissionThreads: function () {
    var controller = this;
    var threads = Ember.Map.create();

    controller.get('content').sortBy('student').getEach('student').uniq().forEach(function (student) {
      if (!threads.has(student)) {
        var submissions = controller.studentWork(student);
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
  }.property('content.[]'),

  submissionThreadHeads: function () {
    var pointers = [];
    var threads = this.get('submissionThreads');

    threads.forEach(function (student) {
      pointers.pushObject(threads.get(student).get('lastObject')); //this here refers to the map
    });

    return pointers;
  }.property('submissionThreads.[]'),

  currentThread: function () {
    return this.get('submissionThreads').get(this.get('currentStudent'));
  }.property('currentSubmission'),

  currentRevisions: function () {
    var dateTime = 'l h:mm';
    var thread = this.get('currentThread');
    var revisions = [];

    if (thread) {
      revisions = thread.map(function (submission, index, thread) {
        return {
          index: index + 1, // Because arrays are zero-indexed
          label: moment(submission.get('createDate')).format(dateTime),
          revision: submission,
          thread: thread.get('lastObject')
        };
      });
    }

    return revisions;
  }.property('currentThread'),

  studentWork: function studentWork(student) {
    var submissions = this.get('arrangedContent').filterBy('student', student).sortBy('createDate');

    return submissions;
  },

  prevThread: function () {
    var thread = this.get('currentThread.lastObject');

    if (thread === this.get('firstThread')) {
      return this.get('lastThread');
    }

    var prevIndex = this.get('submissionThreadHeads').indexOf(thread) - 1;
    var prev = this.get('submissionThreadHeads').objectAt(prevIndex);

    return prev;
  }.property('currentThread', 'firstThread'),

  currentSubmissionIndex: function () {
    return this.get('arrangedContent').indexOf(this.get('currentSubmission'));
  }.property('currentSubmission', 'currentThread', 'arrangedContent'),

  usersSubmissionIndex: function () {
    return this.get('currentSubmissionIndex') + 1;
  }.property('currentSubmissionIndex'),

  nextThread: function () {
    var thread = this.get('currentThread.lastObject');

    if (thread === this.get('lastThread')) {
      return this.get('firstThread');
    }

    var nextIndex = this.get('submissionThreadHeads').indexOf(thread) + 1;
    var next = this.get('submissionThreadHeads').objectAt(nextIndex);

    return next;
  }.property('currentSubmission', 'currentThread', 'lastThread'),

  actions: {
    toggleStudentList: function toggleStudentList() {
      this.set('showStudents', !this.get('showStudents'));
    },

    showAllRevisions: function showAllRevisions() {
      this.set('manyRevisions', false);
    }

  }
});
//# sourceMappingURL=workspace_submissions_controller.js.map
