Encompass.WorkspaceListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  tagName: '',

  actions: {
    toCopyWorkspace(workspace) {
      this.get("toCopyWorkspace")(workspace);
    }
  }

});