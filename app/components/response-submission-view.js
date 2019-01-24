Encompass.ResponseSubmissionViewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'response-submission-view',
  isShortExpanded: true,
  isLongExpanded: true,
  isImageExpanded: false,
  isUploadExpanded: false,
  isRevising: false,

  isOwnSubmission: function() {
    return this.get('submission.creator.studentId') === this.get('currentUser.id');
  }.property('submission.creator.studentId'),

  canRevise: function() {
    return this.get('isOwnSubmission');
  }.property('isOwnSubmission'),

  showButtonRow: function() {
    return this.get('canRevise');
  }.property('canRevise'),

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
    insertQuillContent: function(selector, options) {
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
  }
});