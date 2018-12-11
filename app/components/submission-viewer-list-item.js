Encompass.SubmissionViewerListItemComponent = Ember.Component.extend({
  elementId: ['submission-viewer-list-item'],

  isChecked: function() {
    return this.get('selectedSubmissionIds').includes(this.get('submission.id'));
  }.property('selectedSubmissionIds.[]'),

  actions: {
    onSelect: function() {
      this.get('onSelect')(this.get('submission.id'));
    }
  }

});