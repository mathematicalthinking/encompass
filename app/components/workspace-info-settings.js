Encompass.WorkspaceInfoSettingsComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: ['workspace-info-settings'],

  actions: {
    editWorkspaceInfo () {
      this.set('isEditing', true);
    },
  }
});