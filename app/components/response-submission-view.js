import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  utils: service('utility-methods'),

  elementId: 'response-submission-view',
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

    if (this.submission.id !== this.currentSubmissionId) {
      this.set('currentSubmissionId', this.submission.id);
      this.set('isRevising', false);
    }
    if (this.studentSubmissions) {
      this.set('submissionList', this.studentSubmissions);
    }

    if (this.response) {
      if (this.primaryResponse.id !== this.response.id) {
        // response route changed, set submission to the responses submission

        this.set('submissionToView', this.submission);
        this.set('primaryResponse', this.response);
      }
    }
  },

  isOwnSubmission: computed('submission.creator.studentId', function () {
    return this.submission.creator.studentId === this.currentUser.id;
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
      let problemId = this.submission.answer.problem.id;

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
        this.set('revisedBriefSummary', this.submission.answer.answer);
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

      let explanation = this.submission.answer.explanation;

      let students = this.submission.answer.students;
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
