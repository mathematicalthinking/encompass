import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import each from 'lodash-es/each';
import isNull from 'lodash-es/isNull';
export default class WorkspaceInfoSettingsComponent extends Component {
  @service('current-user') currentUser;
  @service('sweet-alert') alert;
  @service('workspace-permissions') permissions;
  @service('utility-methods') utils;
  @service store;
  @service('error-handling') errorHandling;
  @tracked selectedMode = null;
  get workspacePermissions() {
    return this.args.workspace.permissions;
  }
  @tracked selectedLinkedAssignment = null;
  @tracked selectedAutoUpdateSetting = null;
  @tracked didLinkedAssignmentChange = false;
  @tracked isEditing = false;
  @tracked selectedMode = '';
  @tracked selectedAutoUpdateSetting = 'No';
  @tracked saveOwner = {};
  @tracked missingLinkedAssignment = false;
  @tracked missingChildWorkspaces = false;
  @tracked isUpdateRequestInProgress = false;
  @tracked createdParentData = {};
  @tracked updatedParentData = {};
  @tracked updateErrors = null; // set directly from results; kept local

  // serverErrors is populated via the error-handling service
  get serverErrors() {
    return this.errorHandling.getErrors('serverErrors') || null;
  }
  @tracked wereNoAnswersToUpdate = false;
  @tracked addedSubmissions = null;

  get isParentWs() {
    return this.args.workspace.workspaceType === 'parent';
  }
  get hasChildWorkspaces() {
    return this.args.childWorkspaces.length > 0;
  }

  get doShowLinkedAssignment() {
    return (
      this.permissions.hasOwnerPrivileges(this.args.workspace) &&
      !this.isParentWs
    );
  }

  get initialOwnerItem() {
    const ownerId = this.args.workspace.belongsTo('owner').id();
    if (ownerId) {
      return [ownerId];
    }
    return [];
  }

  get initialLinkedAssignmentItem() {
    const linkedAssignmentId = this.args.workspace
      .belongsTo('linkedAssignment')
      .id();

    if (linkedAssignmentId) {
      return [linkedAssignmentId];
    }
    return [];
  }

  get doShowChildWorkspaces() {
    return (
      this.permissions.hasOwnerPrivileges(this.args.workspace) &&
      this.isParentWs
    );
  }

  get modes() {
    const basic = ['private', 'org', 'public'];

    if (this.currentUser.user.isStudent || !this.currentUser.user.isAdmin) {
      return basic;
    }

    return ['private', 'org', 'public', 'internet'];
  }

  yesNoMySelect = ['Yes', 'No'];

  boolToYesNo(boolean) {
    return boolean ? 'Yes' : 'No';
  }

  @action setSelectedMode(val) {
    this.selectedMode = val;
  }
  @action setSelectedAutoUpdateSetting(val) {
    this.selectedAutoUpdateSetting = val;
  }
  @action clearMissingLinkedAssignment() {
    this.missingLinkedAssignment = null;
  }
  @action clearMissingChildWorkspaces() {
    this.missingChildWorkspaces = null;
  }

  // Dismiss a single error. serverErrors lives in the error-handling service;
  // updateErrors is a local field set directly from the update results.
  @action removeErrorFromArray(prop, err) {
    if (prop === 'serverErrors') {
      this.errorHandling.removeErrorFromArray(prop, err);
    } else if (Array.isArray(this[prop])) {
      this[prop] = this[prop].filter((e) => e !== err);
    }
  }

  @action editWorkspaceInfo() {
    this.isEditing = true;
    let workspace = this.args.workspace;
    this.selectedMode = workspace.mode;

    let selectedAutoUpdateSetting = this.isParentWs
      ? workspace.doAutoUpdateFromChildren
      : workspace.doAllowSubmissionUpdates;
    this.selectedAutoUpdateSetting = this.boolToYesNo(
      selectedAutoUpdateSetting
    );
  }

  @action setOwner(val) {
    const workspace = this.args.workspace;

    if (!val) {
      return;
    }

    const user = this.store.peekRecord('user', val);
    if (this.utils.isNonEmptyObject(user)) {
      workspace.owner = user;
      const ownerOrg = user.belongsTo('organization').value();
      const ownerOrgName = ownerOrg?.name;
      const ownerOrgId = ownerOrg?.id;
      const workspaceOrg = workspace.belongsTo('organization').value();
      const workspaceOrgName = workspaceOrg?.name;
      const workspaceOrgId = workspaceOrg?.id;

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
                workspace.organization = ownerOrg;
                this.saveOwner = user;
              } else {
                workspace.organization = workspaceOrg;
                this.saveOwner = user;
              }
            });
        } else {
          workspace.organization = ownerOrg;
          this.saveOwner = user;
        }
      } else {
        workspace.organization = ownerOrg;
        this.saveOwner = user;
      }
    }
  }

  @action setLinkedAssignment(val, $item) {
    if (!val) {
      return;
    }

    let linkedAssignmentId = this.args.linkedAssignment.id;

    if (isNull($item)) {
      if (linkedAssignmentId) {
        this.selectedLinkedAssignment = null;
        this.didLinkedAssignmentChange = true;
      }
      return;
    }

    let assignment = this.store.peekRecord('assignment', val);

    if (assignment) {
      if (assignment.id !== linkedAssignmentId) {
        this.selectedLinkedAssignment = assignment;
        this.didLinkedAssignmentChange = true;
      }
    }
  }

  @action checkWorkspace() {
    const workspace = this.args.workspace;
    const workspaceOrg = workspace.belongsTo('organization').value();
    const workspaceOwner = workspace.belongsTo('owner').value();
    const ownerOrg = workspaceOwner?.belongsTo('organization').value();
    const ownerOrgName = ownerOrg?.name;
    const mode = this.selectedMode;
    workspace.mode = mode;
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
            workspace.organization = ownerOrg;
            this.saveWorkspace();
          }
        });
    } else {
      this.saveWorkspace();
    }
  }

  @action saveWorkspace() {
    //only make put request if there were changes - works but not for owner
    let workspace = this.args.workspace;

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

      if (updateSettingBool !== workspace[updateProp]) {
        workspace[updateProp] = updateSettingBool;
      }
    }

    if (this.didLinkedAssignmentChange) {
      workspace.linkedAssignment = this.selectedLinkedAssignment;
    }

    if (
      workspace.hasDirtyAttributes ||
      this.saveOwner ||
      this.didLinkedAssignmentChange
    ) {
      let workspace = this.args.workspace;
      workspace
        .save()
        .then(() => {
          this.alert.showToast(
            'success',
            'Workspace Updated',
            'bottom-end',
            3000,
            null,
            false
          );
          this.isEditing = false;
          this.saveOwner = null;
          this.didLinkedAssignmentChange = false;
        })
        .catch((err) => {
          this.errorHandling.handleErrors(err, 'updateRecordErrors', workspace);
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
      this.isEditing = false;
    }
  }
  @action stopEditing() {
    this.isEditing = false;
    this.didLinkedAssignmentChange = false;
    this.selectedLinkedAssignment = null;
  }

  @action updateWithExistingWork() {
    each(
      [
        'wereNoAnswersToUpdate',
        'updateErrors',
        'addedSubmissions',
        'missingLinkedAssignment',
        'missingChildWorkspaces',
      ],
      (prop) => {
        if (this[prop]) {
          this[prop] = null;
        }
      }
    );
    // serverErrors lives in the error-handling service, not on the component
    this.errorHandling.removeMessages('serverErrors');

    let isParentUpdate = this.isParentWs;

    if (!this.args.workspace) {
      return;
    }

    if (!this.args.linkedAssignment && !isParentUpdate) {
      this.missingLinkedAssignment = true;
      return;
    }

    // Check if linkedAssignment proxy has actual content
    let linkedAssignment = isParentUpdate
      ? null
      : this.args.linkedAssignment?.content || this.args.linkedAssignment;

    // If we have a proxy but no content, treat it as missing
    if (!isParentUpdate && (!linkedAssignment || !linkedAssignment.id)) {
      this.missingLinkedAssignment = true;
      return;
    }

    if (isParentUpdate && !this.hasChildWorkspaces) {
      return (this.missingChildWorkspaces = true);
    }

    this.isUpdateRequestInProgress = true;

    // Get the actual assignment from the belongsTo proxy

    let newUpdateRequest = this.store.createRecord('updateWorkspaceRequest', {
      workspace: this.args.workspace,
      linkedAssignment: linkedAssignment,
      createdBy: this.currentUser.user,
      isParentUpdate: this.isParentWs,
    });

    newUpdateRequest
      .save()
      .then((results) => {
        this.isUpdateRequestInProgress = false;

        if (isParentUpdate) {
          if (results.wasNoDataToUpdate === true) {
            console.log('[UPDATE WORKSPACE] Parent workspace up to date');
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
            let createdParentData = results.createdParentData;

            this.createdParentData = createdParentData;

            let updatedParentData = results.updatedParentData;
            this.updatedParentData = updatedParentData;

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

        if (results.wereNoAnswersToUpdate === true) {
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
        if (this.utils.isNonEmptyArray(results.updateErrors)) {
          this.updateErrors = results.updateErrors;
          return;
        }

        if (results.addedSubmissions) {
          let count = results.addedSubmissions.length;
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
        console.error('[UPDATE WORKSPACE] ❌ Error caught:', err);

        // Check if this is the Ember Data assertion error for embedded relationship objects
        // This happens when the server returns full user objects instead of just {type, id}
        // The update actually succeeded on the server, but the response has formatting issues
        if (
          err.message &&
          err.message.includes(
            'Assertion Failed: Encountered a relationship identifier'
          )
        ) {
          // The update worked, we just need to refresh the workspace data
          return this.args.workspace
            .reload()
            .then(() => {
              this.alert.showToast(
                'success',
                'Workspace updated successfully',
                'bottom-start',
                3000,
                false,
                null
              );
            })
            .catch((reloadErr) => {
              console.error(
                '[UPDATE WORKSPACE] ❌ Error reloading workspace:',
                reloadErr
              );
              // Even if reload fails, the update succeeded
              this.alert.showToast(
                'info',
                'Workspace updated. Please refresh the page.',
                'bottom-start',
                5000,
                false,
                null
              );
            });
        }

        // For other errors, use the standard error handling
        this.errorHandling.handleErrors(err, 'serverErrors');
      });
  }
}
