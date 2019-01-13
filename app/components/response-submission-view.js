Encompass.ResponseSubmissionViewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'response-submission-view',

  didReceiveAttrs() {
   console.log('dra rsv');
  },

  isOwnSubmission: function() {
    return this.get('submission.creator.studentId') === this.get('currentUser.id');
  }.property('submission.creator.studentId'),
});