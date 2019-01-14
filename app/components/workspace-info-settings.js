Encompass.WorkspaceInfoSettingsComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: ['workspace-info-settings'],
  alert: Ember.inject.service('sweet-alert'),
  permissions: Ember.inject.service('workspace-permissions'),
  utils: Ember.inject.service('utility-methods'),
  selectedMode: null,
  workspacePermissions: Ember.computed.alias('workspace.permissions'),

  initialOwnerItem: function () {
    const owner = this.get('workspace.owner');
    console.log('owner is', owner);
    if (this.get('utils').isNonEmptyObject(owner)) {
      return [owner.get('id')];
    }
    return [];
  }.property('workspace.owner'),

  actions: {
    editWorkspaceInfo () {
      this.set('isEditing', true);
      let workspace = this.get('workspace');
      this.set('selectedMode', workspace.get('mode'));
    },

    setOwner(val, $item) {
      const workspace = this.get('workspace');

      if (!val) {
        return;
      }

      const user = this.get('store').peekRecord('user', val);
      if (this.get('utils').isNonEmptyObject(user)) {
        workspace.set('owner', user);
        let ownerOrg = user.get('organization');
        let ownerOrgName = ownerOrg.get('name');
        let ownerOrgId = ownerOrg.get('id');
        let workspaceOrg = workspace.get('organization');
        let workspaceOrgName = workspaceOrg.get('name');
        let workspaceOrgId = workspaceOrg.get('id');

        if (workspaceOrgId) {
          if (workspaceOrgId !== ownerOrgId) {
            this.get('alert').showModal('question', `Do you want to change this workspace's organization`, `This owner belongs to ${ownerOrgName} but this workspace belongs to ${workspaceOrgName}`, 'Yes, change it', 'No, keep it').then((results) => {
              if (results.value) {
                workspace.set('organization', ownerOrg);
                this.send('saveOwner', user);
              } else {
                workspace.set('organization', workspaceOrg);
                this.send('saveOwner', user);
              }
            });
          } else {
            workspace.set('organization', ownerOrg);
            this.send('saveOwner', user);
          }
        } else {
          workspace.set('organization', ownerOrg);
          this.send('saveOwner', user);
        }
      }
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
