Encompass.SubmissionViewerListComponent = Ember.Component.extend({
  elementId: 'submission-viewer-list',

  actions: {
    onSelect: function(answerId) {
      this.get('onSelect')(answerId);
    },
    selectAll: function() {
      this.get('onSelectAll')();
    },
    unselectAll: function() {
      this.get('onUnselectAll')();
    }
  }
});