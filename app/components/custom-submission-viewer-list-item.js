Encompass.CustomSubmissionViewerListItemComponent = Ember.Component.extend({
  elementId: ['custom-submission-viewer-list-item'],

  isChecked: function() {
    return this.get('selectedSubmissionIds').includes(this.get('submission.id'));
  }.property('selectedSubmissionIds.[]'),

  actions: {
    onSelect: function() {
      this.get('onSelect')(this.get('submission.id'));
    }
  }

});