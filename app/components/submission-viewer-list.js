Encompass.SubmissionViewerListComponent = Ember.Component.extend({
  elementId: 'submission-viewer-list',
  isChecked: false,

  actions: {
    onSelect: function(submissionId) {
      this.get('onSelect')(submissionId);
    },
    toggleSelect: function() {
      console.log('clicked toggle Select');
      this.set('isChecked', !this.get('isChecked'));
      console.log('is Checked is', this.get('isChecked'));
      if (this.get('isChecked')) {
        this.send('selectAll');
      } else {
        this.send('unselectAll');
      }
    },
    selectAll: function() {
      this.get('onSelectAll')();
    },
    unselectAll: function() {
      this.get('onUnselectAll')();
    }
  }
});