import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  elementId: () => ['custom-submission-viewer-list-item'],

  isChecked: computed('selectedSubmissionIds.[]', 'submission.id', function () {
    return this.selectedSubmissionIds.includes(this.submission.id);
  }),

  actions: {
    onSelect: function () {
      this.onSelect(this.submission.id);
    },
  },
});
