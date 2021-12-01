import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import _ from 'underscore';
import { inject as service } from '@ember/service';

export default class WorkspaceInfoSettingsComponent extends ErrorHandlingComponent {
  @service('current-user') currentUser;
  @service('sweet-alert') alert;
  @service('workspace-permissions') permissions;
  @service('utility-methods') utils;
  @service store;
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
    const owner = this.args.workspace.get('owner');
    if (this.utils.isNonEmptyObject(owner)) {
      return [owner.get('id')];
    }
    return [];
  }

  get initialLinkedAssignmentItem() {
    let linkedAssignmentId = this.args.linkedAssignment.id;

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
                this.saveOwner = user;
              } else {
                workspace.set('organization', workspaceOrg);
                this.saveOwner = user;
              }
            });
        } else {
          workspace.set('organization', ownerOrg);
          this.saveOwner = user;
        }
      } else {
        workspace.set('organization', ownerOrg);
        this.saveOwner = user;
      }
    }
  }

  @action setLinkedAssignment(val, $item) {
    if (!val) {
      return;
    }

    let linkedAssignmentId = this.args.linkedAssignment.id;

    if (_.isNull($item)) {
      if (linkedAssignmentId) {
        this.selectedLinkedAssignment = null;
        this.didLinkedAssignmentChange = true;
      }
      return;
    }

    let assignment = this.store.peekRecord('assignment', val);

    if (assignment) {
      if (assignment.get('id') !== linkedAssignmentId) {
        this.selectedLinkedAssignment = assignment;
        this.didLinkedAssignmentChange = true;
      }
    }
  }

  @action checkWorkspace() {
    let workspace = this.args.workspace;
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
      this.isEditing = false;
    }
  }
  @action stopEditing() {
    this.isEditing = false;
    this.didLinkedAssignmentChange = false;
    this.selectedLinkedAssignment = null;
  }

  @action updateWithExistingWork() {
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
        if (this[prop]) {
          this[prop] = null;
        }
      }
    );

    let isParentUpdate = this.isParentWs;

    if (!this.args.workspace) {
      return;
    }

    if (!this.args.linkedAssignment && !isParentUpdate) {
      this.missingLinkedAssignment = true;
      return;
    }

    if (isParentUpdate && !this.hasChildWorkspaces) {
      return (this.missingChildWorkspaces = true);
    }

    this.isUpdateRequestInProgress = true;

    let newUpdateRequest = this.store.createRecord('updateWorkspaceRequest', {
      workspace: this.args.workspace,
      linkedAssignment: this.args.linkedAssignment,
      createdBy: this.currentUser.user,
      isParentUpdate: this.isParentWs,
    });
    newUpdateRequest
      .save()
      .then((results) => {
        this.isUpdateRequestInProgress = false;

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
        this.handleErrors(err, 'serverErrors');
      });
  }
}
