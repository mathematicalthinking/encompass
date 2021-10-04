import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { later } from '@ember/runloop';

export default Component.extend({
  elementId: 'vmt-import-step4',

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
      let submission = this.get('createdWorkspace.submissions.firstObject');
      let wsId = this.get('createdWorkspace.id');
      return `/#/workspaces/${wsId}/submissions/${submission}`;
    }
  ),

  handleLoadingMessage: observer(
    'isUploadingAnswer',
    'isCreatingWorkspace',
    'savingAssignment',
    function () {
      const that = this;
      if (
        !this.isUploadingAnswer ||
        !this.isCreatingWorkspace ||
        this.savingAssignment
      ) {
        this.set('showLoadingMessage', false);
        return;
      }
      later(function () {
        if (that.isDestroyed || that.isDestroying) {
          return;
        }
        that.set('showLoadingMessage', true);
      }, 800);
    }
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
