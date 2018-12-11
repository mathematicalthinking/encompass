/*global _:false */
Encompass.WorkspaceNewSettingsComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'workspace-new-settings',
  workspacePermissions: [],
  utils: Ember.inject.service('utility-methods'),
  validModeValues: function() {
    const modeInputs = this.get('modeInputs.inputs');

    if (this.get('utils').isNonEmptyArray(modeInputs)) {
      return modeInputs.map(input => input.value);
    }
    return [];

  }.property('modeInputs'),
  constraints: function() {
    let res = {
      workspaceName: {
        presence: { allowEmpty: false },
        length: { maximum: 500 },
      },

      owner: {
        presence: { allowEmpty: false }
      },

      privacySetting: {
        inclusion: {
          within: this.get('validModeValues'),
          message: 'must be a valid option.'
        }
      },
    };

    return res;

  }.property('validModeValues', 'doCreateFolderSet'),
  modeInputs: function() {
    let res = {
      groupName: 'mode',
      required: true,
      inputs: [
        {
          value: 'private',
          label: 'Private',
        },
        {
          value: 'org',
          label: 'My Org',
        },
        {
          value: 'public',
          label: 'Public',
        },
      ]
    };

    if (this.get('currentUser.isStudent') || !this.get('currentUser.isAdmin') ) {
      return res;
    }

    res.inputs.push({
      value: 'internet',
      label: 'Internet',
    });
    return res;
  }.property('currentUser.isStudent', 'currentUser.isAdmin'),

  ownerOptions: function() {
    if (this.get('users')) {
      return this.get('users').map((user) => {
        return {
          id: user.get('id'),
          username: user.get('username')
        };
      });
    }
    return [];
  }.property('users.[]'),
  folderSetOptions: function() {
    if (this.get('folderSets')) {
      return this.get('folderSets').map((folderSet) => {
        return {
          id: folderSet.get('id'),
          name:folderSet.get('name')
        };
      });
    }
    return [];
  }.property('folderSets.[]'),
  actions: {
    updateSelectizeSingle(val, $item, propToUpdate, model) {
      if (_.isNull($item)) {
        this.set(propToUpdate, null);
        return;
      }
      let record = this.get('store').peekRecord(model, val);
      if (!record) {
        return;
      }
      this.set(propToUpdate, record);
    },
    handleSettings() {
      let errors;
      const workspaceName = this.get('workspaceName');
      const owner = this.get('selectedOwner');
      const privacySetting = this.get('selectedMode');
      const folderSet = this.get('selectedFolderSet');
      const permissions = this.get('workspacePermissions');

      errors = window.validate({workspaceName, owner, privacySetting}, this.get('constraints'));

      if (this.get('utils').isNonEmptyObject(errors)) {
        for (let key of Object.keys(errors)) {
          let errorProp = `${key}Errors`;
          this.set(errorProp, errors[key]);
        }
        return;
      }
      const settings = {
        requestedName: workspaceName,
        owner,
        mode: privacySetting,
        folderSet,
        permissionObjects: permissions
      };
      this.get('onProceed')(settings);
    }
  },

});