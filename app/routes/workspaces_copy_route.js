Encompass.WorkspacesCopyRoute = Encompass.AuthenticatedRoute.extend({
  actions: {
    toWorkspace(id) {
      this.transitionTo('workspace.work', id);
    }
  }
});