Encompass.WorkspaceInfoSettingsComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: ['workspace-info-settings'],
  alert: Ember.inject.service('sweet-alert'),
  permissions: Ember.inject.service('workspace-permissions'),
  utils: Ember.inject.service('utility-methods'),
  selectedMode: null,
  workspacePermissions: Ember.computed.alias('workspace.permissions'),

  actions: {
    editWorkspaceInfo () {
      this.set('isEditing', true);
      let workspace = this.get('workspace');
      this.set('selectedMode', workspace.get('mode'));
    },

    checkWorkspace: function () {
      let workspace = this.get('workspace');
      let workspaceOrg = workspace.get('organization.content');
      let workspaceOwner = workspace.get('owner');
      let ownerOrg = workspaceOwner.get('organization');
      let ownerOrgName = ownerOrg.get('name');
      let mode = this.get('selectedMode');
      workspace.set('mode', mode);
      if (mode === 'org' && workspaceOrg === null) {
        this.get('alert').showModal('info', `Do you want to make this workspace visibile to ${ownerOrgName}`, `Everyone in this organization will be able to see this workspace`, 'Yes', 'No').then((results) => {
          if (results.value) {
            workspace.set('organization', ownerOrg);
            this.send('saveWorkspace');
          }
        });
      } else {
        this.send('saveWorkspace');
      }
    },

    saveWorkspace: function () {
      let workspace = this.get('workspace');
      workspace.save().then((res) => {
        this.get('alert').showToast('success', 'Workspace Updated', 'bottom-end', 3000, null, false);
        this.set('isEditing', false);
      }).catch((err) => {
        this.handleErrors(err, 'updateRecordErrors', workspace);
      });
    },
  }
});
