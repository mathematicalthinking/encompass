Encompass.WorkspaceNewComponent = Ember.Component.extend({
  elementId: 'workspace-new',
  isPows: false,

  actions: {
    toggleView: function(view) {
      console.log('view', view);
      if (view === 'pows') {
        this.set('isPows', true);
      } else {
        this.set('isPows', false);
      }
    },

    toWorkspaces: function() {
      console.log('in toWs ws-new comp');
      this.sendAction('toWorkspaces');
    },

    toWorkspace: function(id) {
      this.sendAction('toWorkspace', id);
    }
  }
});