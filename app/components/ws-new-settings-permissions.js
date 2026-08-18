import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import isNull from 'lodash-es/isNull';
import { tracked } from '@glimmer/tracking';

/**
 *   <WsNewSettingsPermissions
    @permissions={{workspacePermissions}}
    @users={{users}}
    @isEditing={{isEditingPermissions}}
    @selectedCollaborator={{unsavedCollaborator}}
    @initialCollabOptions={{initialCollabOptions}}
    @selectedCollaborators={{selectedCollaborators}}
  />
 */

export default class WorkspaceNewContainerComponent extends Component {
  @service('utility-methods') utils;
  @service store;
  @tracked isEditing = false;
  @tracked selectedCollaborator = this.args.selectedCollaborator || null;
  globalPermissionValue = 'viewOnly';
  globalItems = {
    groupName: 'globalPermissionValue',
    groupLabel: 'Workspace Permissions',
    info: 'Workspace permissions apply to all aspects of a workspace for this user. This means whatever you select applies to all the selections, comments, folders, etc.',
    required: true,
    inputs: [
      {
        label: 'View Only',
        value: 'viewOnly',
        moreInfo:
          'This user will be able to see the workspace, but not add or make any changes',
      },
      {
        label: 'Editor',
        value: 'editor',
        moreInfo:
          'This user can add, delete or modify selections, comments, and folders, but they will not be able to see or create new responses',
      },
      {
        label: 'Mentor',
        value: 'indirectMentor',
        moreInfo:
          'This user can create selections, comments, and folders. They can also send feedback that will be delivered once approved by a designated feedback approver',
      },
      {
        label: 'Mentor with Direct Send',
        value: 'directMentor',
        moreInfo:
          'This user can create selections, comments, and folders. They can also send direct feedback that does not require approval',
      },
      {
        label: 'Approver',
        value: 'approver',
        moreInfo:
          'This user can add, delete or modify selections, comments, and folders. They can directly send their own feedback and approve feedback created by other users',
      },
    ],
  };
  buildPermissionsObject() {
    const user = this.selectedCollaborator;
    const globalSetting = this.globalPermissionValue;

    const results = {
      user,
      submissions: {
        all: true,
      },
      global: globalSetting,
    };

    if (globalSetting === 'viewOnly') {
      results.folders = 1;
      results.selections = 1;
      results.comments = 1;
      results.feedback = 'none';

      return results;
    }

    if (globalSetting === 'editor') {
      results.folders = 3;
      results.selections = 4;
      results.comments = 4;
      results.feedback = 'none';

      return results;
    }

    if (globalSetting === 'indirectMentor') {
      results.folders = 2;
      results.selections = 2;
      results.comments = 2;
      results.feedback = 'authReq';

      return results;
    }

    if (globalSetting === 'directMentor') {
      results.folders = 2;
      results.selections = 2;
      results.comments = 2;
      results.feedback = 'preAuth';

      return results;
    }

    if (globalSetting === 'approver') {
      results.folders = 3;
      results.selections = 4;
      results.comments = 4;
      results.feedback = 'approver';

      return results;
    }
  }

  @action
  updateGlobalPermissionValue(val) {
    this.globalPermissionValue = val;
  }
  @action
  setCollaborator(val, $item) {
    if (!val) {
      return;
    }

    const isRemoval = isNull($item);
    if (isRemoval) {
      this.selectedCollaborator = null;
      return;
    }
    const user = this.store.peekRecord('user', val);
    this.selectedCollaborator = user;
    this.isEditing = true;
  }
  @action
  removeCollab(permissionObj) {
    if (this.utils.isNonEmptyObject(permissionObj)) {
      this.args.onRemovePermission?.(permissionObj);
    }
  }
  @action
  editCollab(permissionObj) {
    const utils = this.utils;
    if (utils.isNonEmptyObject(permissionObj)) {
      const user = permissionObj.user;
      if (utils.isNonEmptyObject(user)) {
        this.selectedCollaborator = user;
        this.isEditing = true;
      }
    }
  }

  @action
  savePermissions() {
    const permissionsObject = this.buildPermissionsObject();

    if (!this.utils.isNonEmptyObject(permissionsObject)) {
      return;
    }

    // Notify parent of save action
    this.args.onSavePermission?.(permissionsObject);

    // clear selectedCollaborator
    // clear selectize input

    this.selectedCollaborator = null;
    document.querySelector('select#collab-select')?.selectize?.clear();
    this.isEditing = false;
  }
}
