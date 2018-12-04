Encompass.SubmissionViewerListComponent = Ember.Component.extend({
  elementId: 'submission-viewer-list',

  actions: {
    onSelect: function(submissionId) {
      this.get('onSelect')(submissionId);
    },
    selectAll: function() {
      this.get('onSelectAll')();
    },
    unselectAll: function() {
      this.get('onUnselectAll')();
    }
  }
});