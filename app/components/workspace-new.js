import Component from '@ember/component';






export default Component.extend({
  elementId: 'workspace-new',
  isPows: false,

  actions: {
    toggleView: function (view) {
      if (view === 'pows') {
        this.set('isPows', true);
      } else {
        this.set('isPows', false);
      }
    },

    toWorkspaces: function (workspaceId, submissionId) {
      this.sendAction('toWorkspaces', workspaceId, submissionId);
    },

    toWorkspace: function (id) {
      this.sendAction('toWorkspace', id);
    }
  }
});