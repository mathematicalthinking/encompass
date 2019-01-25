Encompass.ResponseSubmissionViewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'response-submission-view',
  isShortExpanded: true,
  isLongExpanded: true,
  isImageExpanded: false,
  isUploadExpanded: false,
  isRevising: false,
  submissionList: [],
  primaryResponse: null,

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('studentSubmissions')) {
      this.get('submissionList').addObjects(this.get('studentSubmissions'));
    }

    if (this.get('response')) {
      if (this.get('primaryResponse.id') !== this.get('response.id')) {
        // response route changed, set submission to the responses submission

        this.set('submissionToView', this.get('submission'));
        this.set('primaryResponse', this.get('response'));

      }
    }
  },

  isOwnSubmission: function() {
    return this.get('submission.creator.studentId') === this.get('currentUser.id');
  }.property('submission.creator.studentId'),

  canRevise: function() {
    return this.get('isOwnSubmission');
  }.property('isOwnSubmission'),

  showButtonRow: function() {
    return this.get('canRevise');
  }.property('canRevise'),

  displaySubmission: function() {
    if (this.get('submissionToView')) {
      return this.get('submissionToView');
    }
    return this.get('submission');
  }.property('submission', 'submissionToView'),
  sortedStudentSubmissions: function() {
    return this.get('submissionList').sortBy('createDate');
  }.property('submissionList.[]'),

  actions: {
    openProblem() {
      let problemId = this.get('submission.answer.problem.id');

      if (!problemId) {
        return;
      }

      var getUrl = window.location;
      var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

      window.open(`${baseUrl}#/problems/${problemId}`, 'newwindow', 'width=1200, height=700');
    },
    toggleProperty: function (p) {
      this.toggleProperty(p);
    },
    startRevising() {
      if (!this.get('isRevising')) {
        this.set('revisedBriefSummary', this.get('submission.answer.answer'));
        this.set('isRevising', true);

      }
    },
    cancelRevising() {
      if (this.get('isRevising')) {
        this.set('isRevising', false);
        this.set('revisedBriefSummary', '');
        this.set('revisedExplanation', '');

      }
    },
    insertQuillContent(selector, options) {
      if (!this.get('isRevising')) {
        return;
      }
      // eslint-disable-next-line no-unused-vars
      const quill = new window.Quill(selector, options);

      let explanation = this.get('submission.answer.explanation');

      let students = this.get('submission.answer.students');
      this.set('contributors', students.map(s => s));

      this.$('.ql-editor').html(explanation);
    },
    toSubmissionFromAnswer(answer) {
      this.get('store').queryRecord('submission', {
        filterBy: {
          answer: answer.get('id')
        }
      })
      .then((sub) => {
        if (!this.get('isDestroyed') && !this.get('isDestroying')) {
          this.get('submissionList').addObject(sub);
          this.set('submissionToView', sub);
          this.set('isRevising', false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        this.send('cancelRevising');

      });
    },
    setDisplaySubmission(sub) {
      if (sub && sub.get('id') !== this.get('displaySubmission.id')) {
        this.set('submissionToView', sub);
      }
    }
  }
});