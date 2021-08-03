import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { later } from '@ember/runloop';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  elementId: 'import-work-step6',

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
      let createdWorkspace = this.createdWorkspace;
      return `/#/workspaces/${createdWorkspace._id}/submissions/${createdWorkspace.submissions[0]}`;
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
