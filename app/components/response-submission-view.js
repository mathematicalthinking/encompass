Encompass.ResponseSubmissionViewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {

  utils: Ember.inject.service('utility-methods'),

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

    this.set('isStarredItem', this.hasSubmissionBeenMentored.bind(this));

    if (this.get('submission.id') !== this.get('currentSubmissionId')) {
      this.set('currentSubmissionId', this.get('submission.id'));
      this.set('isRevising', false);
    }
    if (this.get('studentSubmissions')) {
      this.set('submissionList', this.get('studentSubmissions'));
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
    return this.get('submission');
  }.property('submission', 'submissionToView'),
  sortedStudentSubmissions: function() {
    return this.get('submissionList').sortBy('createDate');
  }.property('submissionList.[]'),

  yourMentorReplies: function() {
    let base = this.get('mentorReplies') || [];
    return base.filter((response) => {
      return this.get('utils').getBelongsToId(response, 'createdBy') === this.get('currentUser.id');
    });
  }.property('mentorReplies.[]', 'currentUser'),

  hasSubmissionBeenMentored(submission) {
    let responseIds = this.get('utils').getHasManyIds(submission, 'responses');

    return this.get('yourMentorReplies').find((response) => {
      return responseIds.includes(response.get('id'));
    });
  },

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
          this.send('cancelRevising');
          this.get('sendRevisionNotices')(this.get('submission'), sub);
          this.get('onSubChange')(sub);
        }
      })
      .catch((err) => {
        console.log('err', err);
        this.send('cancelRevising');

      });
    },
    setDisplaySubmission(sub) {
      this.get('onSubChange')(sub);
    }
  }
});