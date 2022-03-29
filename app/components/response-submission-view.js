import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  // tagName set to :'';
  // used to solve ember migration issues (instead of migrating to ember glimmer for now.)
  tagName: '',
  utils: service('utility-methods'),
  currentUser: service('current-user'),
  store: service(),
  // elementId: 'response-submission-view',
  isShortExpanded: true,
  isLongExpanded: true,
  isImageExpanded: false,
  isUploadExpanded: false,
  isRevising: false,
  submissionList: [],
  primaryResponse: null,
  currentSubmissionId: null,

  didReceiveAttrs() {
    this._super(...arguments);

    if (this.get('submission.id') !== this.currentSubmissionId) {
      this.set('currentSubmissionId', this.get('submission.id'));
      this.set('isRevising', false);
    }
    if (this.studentSubmissions) {
      this.set('submissionList', this.studentSubmissions);
    }

    if (this.response) {
      if (this.get('primaryResponse.id') !== this.get('response.id')) {
        // response route changed, set submission to the responses submission

        this.set('submissionToView', this.submission);
        this.set('primaryResponse', this.response);
      }
    }
  },

  isOwnSubmission: computed('submission.creator.studentId', function () {
    return (
      this.get('submission.creator.studentId') ===
      this.get('currentUser.user.id')
    );
  }),

  canRevise: computed('isOwnSubmission', 'isParentWorkspace', function () {
    return !this.isParentWorkspace && this.isOwnSubmission;
  }),

  showButtonRow: computed('canRevise', function () {
    return this.canRevise;
  }),

  displaySubmission: computed('submission', 'submissionToView', function () {
    return this.submission;
  }),
  sortedStudentSubmissions: computed('submissionList.[]', function () {
    return this.submissionList.sortBy('createDate');
  }),
  workspacesToUpdateIds: computed('workspaces', function () {
    return [this.workspace.id];
  }),

  mentoredRevisions: computed(
    'wsResponses.[]',
    'submissionList.[]',
    function () {
      return this.submissionList.filter((sub) => {
        let responseIds = this.utils.getHasManyIds(sub, 'responses');

        return this.wsResponses.find((response) => {
          return responseIds.includes(response.get('id'));
        });
      });
    }
  ),

  revisionsToolTip:
    'Revisions are sorted from oldest to newest, left to right. Star indicates that a revision has been mentored (or you have saved a draft)',

  actions: {
    openProblem() {
      let problemId = this.get('submission.answer.problem.id');

      if (!problemId) {
        return;
      }

      var getUrl = window.location;
      var baseUrl =
        getUrl.protocol +
        '//' +
        getUrl.host +
        '/' +
        getUrl.pathname.split('/')[1];

      window.open(
        `${baseUrl}#/problems/${problemId}`,
        'newwindow',
        'width=1200, height=700'
      );
    },
    toggleProperty: function (p) {
      this.toggleProperty(p);
    },
    startRevising() {
      if (!this.isRevising) {
        this.set('revisedBriefSummary', this.get('submission.answer.answer'));
        this.set('isRevising', true);
      }
    },
    cancelRevising() {
      if (this.isRevising) {
        this.set('isRevising', false);
        this.set('revisedBriefSummary', '');
        this.set('revisedExplanation', '');
      }
    },
    insertQuillContent(selector, options) {
      if (!this.isRevising) {
        return;
      }
      // eslint-disable-next-line no-unused-vars
      const quill = new window.Quill(selector, options);

      let explanation = this.get('submission.answer.explanation');

      let students = this.get('submission.answer.students');
      this.set(
        'contributors',
        students.map((s) => s)
      );

      this.$('.ql-editor').html(explanation);
    },
    toSubmissionFromAnswer(answer) {
      this.store
        .queryRecord('submission', {
          filterBy: {
            answer: answer.get('id'),
          },
        })
        .then((sub) => {
          if (!this.isDestroyed && !this.isDestroying) {
            this.send('cancelRevising');
            // sendRevisionNotices is broken. It's supposed to set up a notification for the mentor who gave feedback
            this.sendRevisionNotices(this.submission, sub);
            this.onSubChange(sub);
          }
        })
        .catch(() => {
          this.send('cancelRevising');
        });
    },
    setDisplaySubmission(sub) {
      this.onSubChange(sub);
    },
  },
});
