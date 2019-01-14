Encompass.ResponseSubmissionViewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'response-submission-view',

  didReceiveAttrs() {
   console.log('dra rsv');
  },

  isOwnSubmission: function() {
    return this.get('submission.creator.studentId') === this.get('currentUser.id');
  }.property('submission.creator.studentId'),

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
  }
});