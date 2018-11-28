Encompass.WorkspaceListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'workspace-list',

  actions: {
    toCopyWorkspace(workspace) {
      this.sendAction("toCopyWorkspace", workspace);
    }
  }

});