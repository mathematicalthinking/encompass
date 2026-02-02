import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import isObject from 'lodash-es/isObject';
import isString from 'lodash-es/isString';
import isNull from 'lodash-es/isNull';
import validate from 'validate.js';

/**
 * WorkspaceNewSettings Component
 *
 * Handles the configuration of new workspace settings including name, owner,
 * privacy mode, folder sets, submission settings, and collaborator permissions.
 *
 * @component
 * @example
 * <WorkspaceNewSettings
 *   @users={{@users}}
 *   @folderSets={{@folderSets}}
 *   @onProceed={{this.createWorkspace}}
 *   @onBack={{this.toSearchFilter}}
 *   @createWorkspaceError={{this.createWorkspaceError}}
 * />
 */
export default class WorkspaceNewSettingsComponent extends Component {
  @service('utility-methods') utils;
  @service('sweet-alert') alert;
  @service currentUser;
  @service store;

  @tracked workspacePermissions = [];
  @tracked isEditingPermissions = false;
  @tracked unsavedCollaborator = null;
  @tracked selectedMode = 'private';
  @tracked selectedSubmissionSettings = 'all';
  @tracked selectedOwner = null;
  @tracked selectedFolderSet = null;
  @tracked workspaceName = '';

  // Error tracking
  @tracked workspaceNameErrors = null;
  @tracked ownerErrors = null;
  @tracked privacySettingErrors = null;
  @tracked folderSetErrors = null;

  constructor() {
    super(...arguments);
    this.selectedOwner = this.currentUser.user;
  }

  get validModeValues() {
    const modeInputs = this.modeInputs?.inputs;

    if (this.utils.isNonEmptyArray(modeInputs)) {
      return modeInputs.map((input) => input.value);
    }
    return [];
  }

  get constraints() {
    return {
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
  }

  submissionSettingsInputs = {
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
  };

  get modeInputs() {
    const user = this.currentUser.user;
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

    if (user?.isStudent || !user?.isAdmin) {
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

  get initialOwner() {
    return [this.currentUser.user?.id];
  }

  get ownerOptions() {
    const users = this.args.users;
    if (users) {
      return users.map((user) => {
        return {
          id: user.get('id'),
          username: user.get('username'),
        };
      });
    }
    return [];
  }

  get folderSetOptions() {
    const folderSets = this.args.folderSets;
    if (folderSets) {
      return folderSets.map((folderSet) => {
        return {
          id: folderSet.get('id'),
          name: folderSet.get('name'),
        };
      });
    }
    return [];
  }

  get initialCollabOptions() {
    let peeked = this.store.peekAll('user');
    let collabs = this.selectedCollaborators;

    if (!isObject(peeked)) {
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
  }

  get selectedCollaborators() {
    let hash = {};
    const workspacePermissions = this.workspacePermissions;

    if (!this.utils.isNonEmptyArray(workspacePermissions)) {
      return hash;
    }
    workspacePermissions.forEach((obj) => {
      let user = obj.user;
      if (isString(user)) {
        hash[user] = true;
      } else if (isObject(user)) {
        hash[user.get('id')] = true;
      }
    });
    return hash;
  }

  @action
  savePermission(permissionObj) {
    const permissions = this.workspacePermissions;
    // check if user already is in array
    let existingObj = permissions.findBy('user', permissionObj.user);

    // remove existing permissions obj and add modified one
    if (existingObj) {
      this.workspacePermissions = permissions.filter(
        (p) => p.user !== permissionObj.user
      );
    }

    this.workspacePermissions = [...this.workspacePermissions, permissionObj];
  }

  @action
  removePermission(permissionObj) {
    if (this.workspacePermissions) {
      this.workspacePermissions = this.workspacePermissions.filter(
        (p) => p !== permissionObj
      );
    }
  }

  @action
  updateSelectedMode(val) {
    this.selectedMode = val;
  }

  @action
  updateSelectedSubmissionSettings(val) {
    this.selectedSubmissionSettings = val;
  }

  @action
  updateSelectizeSingle(val, $item, propToUpdate, model) {
    if (isNull($item)) {
      this[propToUpdate] = null;
      return;
    }
    let record = this.store.peekRecord(model, val);
    if (!record) {
      return;
    }
    this[propToUpdate] = record;
  }

  @action
  handleSettings() {
    const workspaceName = this.workspaceName;
    const owner = this.selectedOwner;
    const privacySetting = this.selectedMode;
    const folderSet = this.selectedFolderSet;
    const permissions = this.workspacePermissions;
    const submissionSettings = this.selectedSubmissionSettings;

    const errors = validate(
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
        this[errorProp] = errors[key];
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
      let username = this.unsavedCollaborator?.username;

      let title = 'Are you sure you want to proceed?';
      let text = `You are currently in the process of editing permissions for ${username}. You will lose any unsaved changes if you continue.`;

      return this.alert
        .showModal('warning', title, text, 'Proceed')
        .then((result) => {
          if (result.value) {
            this.args.onProceed?.(settings);
            return;
          }
        });
    } else {
      this.args.onProceed?.(settings);
    }
  }

  @action
  back() {
    this.args.onBack?.();
  }

  @action
  resetError(errorProp) {
    this[errorProp] = null;
  }
}
