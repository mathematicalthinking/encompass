/*global _:false */
Encompass.ImportWorkStep6Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step6',

  shouldHideButtons: function () {
    if (this.get('isUploadingAnswer') || this.get('isCreatingWorkspace') || this.get('savingAssignment') || this.get('uploadedAnswers')) {
      return true;
    } else {
      return false;
    }
  }.property('isUploadingAnswer', 'isCreatingWorkspace', 'savingAssignment', 'uploadedAnswers'),

  workspaceLink: function () {
    let createdWorkspace = this.get('createdWorkspace');
    return `/#/workspaces/${createdWorkspace._id}/submissions/${createdWorkspace.submissions[0]}`;
  }.property('isCreatingWorkspace', 'createdWorkspace'),

  handleLoadingMessage: function() {
    const that = this;
    if (!this.get('isUploadingAnswer') || !this.get('isCreatingWorkspace') || this.get('savingAssignment')) {
      this.set('showLoadingMessage', false);
      return;
    }
    Ember.run.later(function() {
      if (that.isDestroyed || that.isDestroying) {
        return;
      }
      that.set('showLoadingMessage', true);
    }, 800);

  }.observes('isUploadingAnswer', 'isCreatingWorkspace', 'savingAssignment'),

  actions: {
    next() {
      this.get('onProceed')();
    },
    back() {
      this.get('onBack')(-1);
    }
  }
});