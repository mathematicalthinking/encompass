Encompass.CustomSubmissionViewerListComponent = Ember.Component.extend({
  elementId: 'custom-submission-viewer-list',
  isChecked: false,

  didReceiveAttributes() {
    if (!Array.isArray(this.get('selectedSubmissionIds'))) {
      this.set('selectedSubmissionIds', []);
    }
    this._super(...arguments);
  },

  actions: {
    onSelect: function(submissionId) {
      this.get('onSelect')(submissionId);
    },
    toggleSelect: function() {
      this.set('isChecked', !this.get('isChecked'));
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
    },
    doneSelecting: function() {
      this.get('onDoneSelecting')();
    },
  }
});