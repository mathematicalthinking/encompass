import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { alias, equal, gt } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(CurrentUserMixin, ErrorHandlingMixin, {
  elementId: ['workspace-info-settings'],
  alert: service('sweet-alert'),
  permissions: service('workspace-permissions'),
  utils: service('utility-methods'),
  selectedMode: null,
  workspacePermissions: alias('workspace.permissions'),
  selectedLinkedAssignment: null,
  selectedAutoUpdateSetting: null,
  didLinkedAssignmentChange: false,

  isParentWs: equal('workspace.workspaceType', 'parent'),
  hasChildWorkspaces: gt('childWorkspaces.length', 0),

  didReceiveAttrs() {
    this._super(...arguments);
  },

  doShowLinkedAssignment: computed('currentUser', 'isParentWs', function () {
    return (
      this.permissions.hasOwnerPrivileges(this.workspace) && !this.isParentWs
    );
  }),

  initialOwnerItem: computed('workspace.owner', function () {
    const owner = this.workspace.owner;
    if (this.utils.isNonEmptyObject(owner)) {
      return [owner.get('id')];
    }
    return [];
  }),

  initialLinkedAssignmentItem: computed('linkedAssignment', function () {
    let linkedAssignmentId = this.linkedAssignment.id;

    if (linkedAssignmentId) {
      return [linkedAssignmentId];
    }
    return [];
  }),

  doShowChildWorkspaces: computed('currentUser', 'isParentWs', function () {
    return (
      this.permissions.hasOwnerPrivileges(this.workspace) && this.isParentWs
    );
  }),

  modes: computed('currentUser.isAdmin', 'currentUser.isStudent', function () {
    const basic = ['private', 'org', 'public'];

    if (this.currentUser.isStudent || !this.currentUser.isAdmin) {
      return basic;
    }

    return ['private', 'org', 'public', 'internet'];
  }),

  yesNoMySelect: ['Yes', 'No'],

  boolToYesNo(boolean) {
    return boolean ? 'Yes' : 'No';
  },

  actions: {
    editWorkspaceInfo() {
      this.set('isEditing', true);
      let workspace = this.workspace;
      this.set('selectedMode', workspace.get('mode'));

      let selectedAutoUpdateSetting = this.isParentWs
        ? workspace.get('doAutoUpdateFromChildren')
        : workspace.get('doAllowSubmissionUpdates');
      this.set(
        'selectedAutoUpdateSetting',
        this.boolToYesNo(selectedAutoUpdateSetting)
      );
    },

    setOwner(val, $item) {
      const workspace = this.workspace;

      if (!val) {
        return;
      }

      const user = this.store.peekRecord('user', val);
      if (this.utils.isNonEmptyObject(user)) {
        workspace.set('owner', user);
        let ownerOrg = user.get('organization');
        let ownerOrgName = ownerOrg.get('name');
        let ownerOrgId = ownerOrg.get('id');
        let workspaceOrg = workspace.get('organization');
        let workspaceOrgName = workspaceOrg.get('name');
        let workspaceOrgId = workspaceOrg.get('id');

        if (workspaceOrgId) {
          if (workspaceOrgId !== ownerOrgId) {
            this.alert
              .showModal(
                'question',
                `Do you want to change this workspace's organization`,
                `This owner belongs to ${ownerOrgName} but this workspace belongs to ${workspaceOrgName}`,
                'Yes, change it',
                'No, keep it'
              )
              .then((results) => {
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

      let linkedAssignmentId = this.linkedAssignment.id;

      if (_.isNull($item)) {
        if (linkedAssignmentId) {
          this.set('selectedLinkedAssignment', null);
          this.set('didLinkedAssignmentChange', true);
        }
        return;
      }

      let assignment = this.store.peekRecord('assignment', val);

      if (assignment) {
        if (assignment.get('id') !== linkedAssignmentId) {
          this.set('selectedLinkedAssignment', assignment);
          this.set('didLinkedAssignmentChange', true);
        }
      }
    },

    checkWorkspace: function () {
      let workspace = this.workspace;
      let workspaceOrg = workspace.get('organization.content');
      let workspaceOwner = workspace.get('owner');
      let ownerOrg = workspaceOwner.get('organization');
      let ownerOrgName = ownerOrg.get('name');
      let mode = this.selectedMode;
      workspace.set('mode', mode);
      if (mode === 'org' && workspaceOrg === null) {
        this.alert
          .showModal(
            'info',
            `Do you want to make this workspace visibile to ${ownerOrgName}`,
            `Everyone in this organization will be able to see this workspace`,
            'Yes',
            'No'
          )
          .then((results) => {
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
      let workspace = this.workspace;

      let updateSetting = this.selectedAutoUpdateSetting;

      let updateSettingBool;

      if (updateSetting === 'Yes') {
        updateSettingBool = true;
      } else if (updateSetting === 'No') {
        updateSettingBool = false;
      }

      if (typeof updateSettingBool === 'boolean') {
        let updateProp = this.isParentWs
          ? 'doAutoUpdateFromChildren'
          : 'doAllowSubmissionUpdates';

        if (updateSettingBool !== workspace.get(updateProp)) {
          workspace.set(updateProp, updateSettingBool);
        }
      }

      if (this.didLinkedAssignmentChange) {
        workspace.set('linkedAssignment', this.selectedLinkedAssignment);
      }

      if (
        workspace.get('hasDirtyAttributes') ||
        this.saveOwner ||
        this.didLinkedAssignmentChange
      ) {
        let workspace = this.workspace;
        workspace
          .save()
          .then((res) => {
            this.alert.showToast(
              'success',
              'Workspace Updated',
              'bottom-end',
              3000,
              null,
              false
            );
            this.set('isEditing', false);
            this.set('saveOwner', null);
            this.set('didLinkedAssignmentChange', false);
          })
          .catch((err) => {
            this.handleErrors(err, 'updateRecordErrors', workspace);
          });
      } else {
        this.alert.showToast(
          'info',
          'No Changes to Save',
          'bottom-start',
          3000,
          false,
          null
        );
        this.set('isEditing', false);
      }
    },
    stopEditing() {
      console.log('stop editing');
      this.set('isEditing', false);
      this.set('didLinkedAssignmentChange', false);
      this.set('selectedLinkedAssignment', null);
    },

    updateWithExistingWork() {
      _.each(
        [
          'wereNoAnswersToUpdate',
          'updateErrors',
          'addedSubmissions',
          'missingLinkedAssignment',
          'serverErrors',
          'missingChildWorkspaces',
        ],
        (prop) => {
          if (this.get(prop)) {
            this.set(prop, null);
          }
        }
      );

      let isParentUpdate = this.isParentWs;

      if (!this.workspace) {
        return;
      }

      if (!this.linkedAssignment && !isParentUpdate) {
        this.set('missingLinkedAssignment', true);
        return;
      }

      if (isParentUpdate && !this.hasChildWorkspaces) {
        return this.set('missingChildWorkspaces', true);
      }

      this.set('isUpdateRequestInProgress', true);

      let newUpdateRequest = this.store.createRecord('updateWorkspaceRequest', {
        workspace: this.workspace,
        linkedAssignment: this.linkedAssignment,
        createdBy: this.currentUser,
        isParentUpdate: this.isParentWs,
      });
      newUpdateRequest
        .save()
        .then((results) => {
          this.set('isUpdateRequestInProgress', false);

          if (isParentUpdate) {
            if (results.get('wasNoDataToUpdate') === true) {
              this.alert.showToast(
                'info',
                'Workspace Up to Date',
                'bottom-start',
                3000,
                false,
                null
              );
              return;
            } else {
              let createdParentData = results.get('createdParentData');

              this.set('createdParentData', createdParentData);

              let updatedParentData = results.get('updatedParentData');
              this.set('updatedParentData', updatedParentData);

              let msg = 'Successfully updated parent workspace';
              return this.alert.showToast(
                'success',
                msg,
                'bottom-start',
                3000,
                false,
                null
              );
            }
          }

          if (results.get('wereNoAnswersToUpdate') === true) {
            this.alert.showToast(
              'info',
              'Workspace Up to Date',
              'bottom-start',
              3000,
              false,
              null
            );
            return;
          }
          if (this.utils.isNonEmptyArray(results.get('updateErrors'))) {
            this.set('updateErrors', results.get('updateErrors'));
            return;
          }

          if (results.get('addedSubmissions')) {
            let count = results.get('addedSubmissions.length');
            let msg = `Added ${count} new submissions`;
            if (count === 1) {
              msg = 'Added 1 new submission';
            }
            return this.alert.showToast(
              'success',
              msg,
              'bottom-start',
              3000,
              false,
              null
            );
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'serverErrors');
        });
    },
  },
});
