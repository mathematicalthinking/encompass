import Component from '@ember/component';






export default Component.extend({
  elementId: 'custom-submission-viewer-list',
  isChecked: false,

  didReceiveAttributes() {
    if (!Array.isArray(this.selectedSubmissionIds)) {
      this.set('selectedSubmissionIds', []);
    }
    this._super(...arguments);
  },

  actions: {
    onSelect: function (submissionId) {
      this.onSelect(submissionId);
    },
    toggleSelect: function () {
      this.set('isChecked', !this.isChecked);
      if (this.isChecked) {
        this.send('selectAll');
      } else {
        this.send('unselectAll');
      }
    },
    selectAll: function () {
      this.onSelectAll();
    },
    unselectAll: function () {
      this.onUnselectAll();
    },
    doneSelecting: function () {
      this.onDoneSelecting();
    },
  }
});