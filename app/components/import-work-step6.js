import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  shouldHideButtons: computed(
    'isUploadingAnswer',
    'isCreatingWorkspace',
    'savingAssignment',
    'uploadedAnswers',
    function () {
      if (
        this.isUploadingAnswer ||
        this.isCreatingWorkspace ||
        this.savingAssignment ||
        this.uploadedAnswers
      ) {
        return true;
      } else {
        return false;
      }
    }
  ),

  workspaceLink: computed(
    'isCreatingWorkspace',
    'createdWorkspace',
    function () {
      const createdWorkspace = this.createdWorkspace;
      const workspaceId = createdWorkspace?._id;
      if (!workspaceId) {
        return '/#/workspaces';
      }
      const firstSubmissionId = createdWorkspace?.submissions?.[0];
      if (!firstSubmissionId) {
        return `/#/workspaces/${workspaceId}/work`;
      }
      return `/#/workspaces/${workspaceId}/submissions/${firstSubmissionId}`;
    }
  ),

  showLoadingMessage: or(
    'isUploadingAnswer',
    'isCreatingWorkspace',
    'savingAssignment'
  ),

  actions: {
    next() {
      this.onProceed();
    },
    back() {
      this.onBack(-1);
    },
  },
});
