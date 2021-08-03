import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { inject as service } from '@ember/service';

export default Component.extend({
  elementId: 'workspace-new-settings',
  workspacePermissions: [],
  utils: service('utility-methods'),
  alert: service('sweet-alert'),
  isEditingPermissions: false,
  unsavedCollaborator: null,
  selectedMode: 'private',
  selectedSubmissionSettings: 'all',

  validModeValues: computed('modeInputs', function () {
    const modeInputs = this.modeInputs.inputs;

    if (this.utils.isNonEmptyArray(modeInputs)) {
      return modeInputs.map((input) => input.value);
    }
    return [];
  }),
  constraints: computed('validModeValues', 'doCreateFolderSet', function () {
    let res = {
      workspaceName: {
        presence: { allowEmpty: false },
        length: { maximum: 500 },
      },

      owner: {
        presence: { allowEmpty: false },
      },

      privacySetting: {
        inclusion: {
          within: this.validModeValues,
          message: 'must be a valid option.',
        },
      },
    };

    return res;
  }),
  submissionSettingsInputs: {
    groupName: 'submissionSettings',
    required: true,
    inputs: [
      {
        value: 'all',
        label: 'All Submissions',
        moreInfo: 'Workspace will include all revisions',
      },
      {
        value: 'mostRecent',
        label: 'Most Recent Only',
        moreInfo: 'Workspace will only include submissions of record',
      },
    ],
  },
  modeInputs: computed(
    'currentUser.isStudent',
    'currentUser.isAdmin',
    function () {
      let res = {
        groupName: 'mode',
        required: true,
        inputs: [
          {
            value: 'private',
            label: 'Private',
            moreInfo:
              'Workspace will only be visible to the owner and collaborators',
          },
          {
            value: 'org',
            label: 'My Org',
            moreInfo:
              'Workspace will be visible to everyone belonging to your org',
          },
          {
            value: 'public',
            label: 'Public',
            moreInfo: 'Workspace will be visible to every Encompass user',
          },
        ],
      };

      if (this.currentUser.isStudent || !this.currentUser.isAdmin) {
        return res;
      }

      res.inputs.push({
        value: 'internet',
        label: 'Internet',
        moreInfo:
          'Workspace will be accesible to any user with a link to the workspace',
      });
      return res;
    }
  ),

  ownerOptions: computed('users.[]', function () {
    if (this.users) {
      return this.users.map((user) => {
        return {
          id: user.get('id'),
          username: user.get('username'),
        };
      });
    }
    return [];
  }),
  folderSetOptions: computed('folderSets.[]', function () {
    if (this.folderSets) {
      return this.folderSets.map((folderSet) => {
        return {
          id: folderSet.get('id'),
          name: folderSet.get('name'),
        };
      });
    }
    return [];
  }),

  initialCollabOptions: computed('selectedCollaborators', function () {
    let peeked = this.store.peekAll('user');
    let collabs = this.selectedCollaborators;

    if (!_.isObject(peeked)) {
      return [];
    }
    let filtered = peeked.reject((record) => {
      return collabs[record.get('id')];
    });
    return filtered.map((obj) => {
      return {
        id: obj.get('id'),
        username: obj.get('username'),
      };
    });
  }),

  selectedCollaborators: computed('workspacePermissions.[]', function () {
    let hash = {};
    // let wsOwnerId = this.workspace.owner.id;

    // no reason to set owner as a collaborator
    // if (wsOwnerId) {
    //   hash[wsOwnerId] = true;
    // }
    const workspacePermissions = this.workspacePermissions;

    if (!this.utils.isNonEmptyArray(workspacePermissions)) {
      return hash;
    }
    workspacePermissions.forEach((obj) => {
      let user = obj.user;
      if (_.isString(user)) {
        hash[user] = true;
      } else if (_.isObject(user)) {
        hash[user.get('id')] = true;
      }
    });
    return hash;
  }),
  actions: {
    updateSelectizeSingle(val, $item, propToUpdate, model) {
      if (_.isNull($item)) {
        this.set(propToUpdate, null);
        return;
      }
      let record = this.store.peekRecord(model, val);
      if (!record) {
        return;
      }
      this.set(propToUpdate, record);
    },
    handleSettings() {
      let errors;
      const workspaceName = this.workspaceName;
      const owner = this.selectedOwner;
      const privacySetting = this.selectedMode;
      const folderSet = this.selectedFolderSet;
      const permissions = this.workspacePermissions;
      const submissionSettings = this.selectedSubmissionSettings;

      errors = window.validate(
        { workspaceName, owner, privacySetting },
        this.constraints
      );

      if (this.utils.isNonEmptyObject(errors)) {
        this.alert.showToast(
          'error',
          'Missing required info',
          'bottom-end',
          3000,
          false,
          null
        );
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
        permissionObjects: permissions,
        submissionSettings,
      };

      if (this.isEditingPermissions) {
        // prompt user to confirm they want to proceed
        let username = this.unsavedCollaborator.username;

        let title = 'Are you sure you want to proceed?';
        let text = `You are currently in the process of editing permissions for ${username}. You will lose any unsaved changes if you continue.`;

        return this.alert
          .showModal('warning', title, text, 'Proceed')
          .then((result) => {
            if (result.value) {
              this.onProceed(settings);
              return;
            }
          });
      } else {
        this.onProceed(settings);
      }
    },
    back() {
      this.onBack();
    },
  },
});
