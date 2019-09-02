/*global _:false */
Encompass.WorkspaceInfoSettingsComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: ['workspace-info-settings'],
  alert: Ember.inject.service('sweet-alert'),
  permissions: Ember.inject.service('workspace-permissions'),
  utils: Ember.inject.service('utility-methods'),
  selectedMode: null,
  workspacePermissions: Ember.computed.alias('workspace.permissions'),
  selectedLinkedAssignment: null,
  selectedAutoUpdateSetting: null,
  didLinkedAssignmentChange: false,

  isParentWs: Ember.computed.equal('workspace.workspaceType', 'parent'),
  hasChildWorkspaces: Ember.computed.gt('childWorkspaces.length', 0),

  didReceiveAttrs() {
    this._super(...arguments);
  },

  doShowLinkedAssignment: function() {
    return this.get('permissions').hasOwnerPrivileges(this.get('workspace')) && !this.get('isParentWs');
  }.property('currentUser', 'isParentWs'),

  initialOwnerItem: function () {
    const owner = this.get('workspace.owner');
    if (this.get('utils').isNonEmptyObject(owner)) {
      return [owner.get('id')];
    }
    return [];
  }.property('workspace.owner'),

  initialLinkedAssignmentItem: function() {
    let linkedAssignmentId = this.get('linkedAssignment.id');

    if (linkedAssignmentId) {
      return [linkedAssignmentId];
    }
    return [];
  }.property('linkedAssignment'),

  doShowChildWorkspaces: function() {
    return this.get('permissions').hasOwnerPrivileges(this.get('workspace')) && this.get('isParentWs');
  }.property('currentUser', 'isParentWs'),

  modes: function () {
    const basic = ['private', 'org', 'public'];

    if (this.get('currentUser.isStudent') || !this.get('currentUser.isAdmin')) {
      return basic;
    }

    return ['private', 'org', 'public', 'internet'];

  }.property('currentUser.isAdmin', 'currentUser.isStudent'),

  yesNoMySelect: ['Yes', 'No'],

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
                this.set('saveOwner', user);
              } else {
                workspace.set('organization', workspaceOrg);
                this.set('saveOwner', user);
              }
            });
          } else {
            workspace.set('organization', ownerOrg);
            this.set('saveOwner', user);
          }
        } else {
          workspace.set('organization', ownerOrg);
          this.set('saveOwner', user);
        }
      }
    },

    setLinkedAssignment(val, $item) {
      if (!val) {
        return;
      }

      let linkedAssignmentId = this.get('linkedAssignment.id');

      if (_.isNull($item)) {
        if (linkedAssignmentId) {
          this.set('selectedLinkedAssignment', null);
          this.set('didLinkedAssignmentChange', true);
        }
        return;
      }

      let assignment = this.get('store').peekRecord('assignment', val);

      if (assignment) {
        if (assignment.get('id') !== linkedAssignmentId) {
          this.set('selectedLinkedAssignment', assignment);
          this.set('didLinkedAssignmentChange', true);
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
      //only make put request if there were changes - works but not for owner
      let workspace = this.get('workspace');

      let updateSetting = this.get('selectedAutoUpdateSetting');

      let updateSettingBool;

      if (updateSetting === 'Yes') {
        updateSettingBool = true;
      } else if (updateSetting === 'No') {
        updateSettingBool = false;
      }

      if (typeof updateSettingBool === 'boolean') {
        let updateProp = this.get('isParentWs') ? 'doAutoUpdateFromChildren' : 'doAllowSubmissionUpdates';

        if (updateSettingBool !== workspace.get(updateProp)) {
          workspace.set(updateProp, updateSettingBool );
        }
      }

      if (this.get('didLinkedAssignmentChange')) {
        workspace.set('linkedAssignment', this.get('selectedLinkedAssignment'));
      }

      if (workspace.get('hasDirtyAttributes') || this.get('saveOwner') || this.get('didLinkedAssignmentChange')) {
        let workspace = this.get('workspace');
        workspace.save().then((res) => {
          this.get('alert').showToast('success', 'Workspace Updated', 'bottom-end', 3000, null, false);
          this.set('isEditing', false);
          this.set('saveOwner', null);
          this.set('didLinkedAssignmentChange', false);
        }).catch((err) => {
          this.handleErrors(err, 'updateRecordErrors', workspace);
        });
      } else {
        this.set('isEditing', false);
      }
    },
    stopEditing() {
      this.set('isEditing', false);
      this.set('didLinkedAssignmentChange', false);
      this.set('selectedLinkedAssignment', null);
    },

    updateWithExistingWork() {
      _.each(['wereNoAnswersToUpdate', 'updateErrors', 'addedSubmissions', 'missingLinkedAssignment', 'serverErrors', 'missingChildWorkspaces'], (prop) => {
        if (this.get(prop)) {
          this.set(prop, null);
        }
      });

      let isParentUpdate = this.get('isParentWs');

      if (!this.get('workspace')) {
        return;
      }

      if (!this.get('linkedAssignment') && !isParentUpdate) {
        this.set('missingLinkedAssignment', true);
        return;
      }

      if (isParentUpdate && !this.get('hasChildWorkspaces')) {
        return this.set('missingChildWorkspaces', true);
      }

      this.set('isUpdateRequestInProgress', true);

      let newUpdateRequest = this.get('store').createRecord('updateWorkspaceRequest', {
        workspace: this.get('workspace'),
        linkedAssignment: this.get('linkedAssignment'),
        createdBy: this.get('currentUser'),
        isParentUpdate: this.get('isParentWs'),
      });
      newUpdateRequest.save()
        .then((results) => {
          this.set('isUpdateRequestInProgress', false);

          if (isParentUpdate) {
            if (results.get('wasNoDataToUpdate') === true) {
              this.get('alert').showToast('info', 'Workspace Up to Date', 'bottom-start', 3000, false, null);
              return;
            } else {
              let updatedData = results.get('updatedParentData');

              this.set('updatedParentData', updatedData);

              let msg = 'Successfully updated parent workspace';
              return this.get('alert').showToast('success', msg , 'bottom-start', 3000, false, null);

            }
          }

          if (results.get('wereNoAnswersToUpdate') === true) {
            this.get('alert').showToast('info', 'Workspace Up to Date', 'bottom-start', 3000, false, null);
            return;
          }
          if (this.get('utils').isNonEmptyArray(results.get('updateErrors'))) {
            this.set('updateErrors', results.get('updateErrors'));
            return;
          }

          if (results.get('addedSubmissions')) {
            let count = results.get('addedSubmissions.length');
            let msg = `Added ${count} new submissions`;
            if (count === 1) {
              msg = 'Added 1 new submission';
            }
            return this.get('alert').showToast('success', msg , 'bottom-start', 3000, false, null);
          }

        })
        .catch((err) => {
          this.handleErrors(err, 'serverErrors');
        });
    },
  }
});
