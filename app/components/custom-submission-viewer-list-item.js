Encompass.CustomSubmissionViewerListItemComponent = Ember.Component.extend({
  elementId: ['custom-submission-viewer-list-item'],

  isChecked: function() {
    const ids = this.get('selectedSubmissionIds');
    if (ids) {
      return ids.includes(this.get('answer.id'));
    }
    return false;
  }.property('selectedSubmissionIds.[]'),

  actions: {
    onSelect: function() {
      this.get('onSelect')(this.get('answer.id'));
    }
  }

});