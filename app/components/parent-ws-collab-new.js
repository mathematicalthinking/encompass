import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ParentWsCollabNewComponent extends Component {
  @service('utility-methods') utils;
  @service('sweet-alert') alert;
  @service store;
  @tracked globalPermissionValue = 'viewOnly';
  @tracked addType = 'individual';
  @tracked existingUserError = false;
  @tracked missingUserError = false;
  get areUsersToAdd() {
    return this.usersToAdd.length > 0;
  }

  get isBulkAdd() {
    return this.addType === 'bulk';
  }

  mainPermissions = [
    {
      id: 1,
      display: 'Hidden',
      value: 0,
    },
    {
      id: 2,
      display: 'View Only',
      value: 1,
    },
    {
      id: 3,
      display: 'Create',
      value: 2,
    },
    {
      id: 4,
      display: 'Edit',
      value: 3,
    },
    {
      id: 5,
      display: 'Delete',
      value: 4,
    },
  ];

  globalItems = {
    groupName: 'globalPermissionValue',
    groupLabel: 'Workspace Permissions',
    info: 'Currently parent workspaces only support read-only permissions',
    required: true,
    inputs: [
      {
        label: 'View Only',
        value: 'viewOnly',
        moreInfo:
          'This user will be able to see the workspace, but not add or make any changes',
      },
    ],
  };

  addTypeItems = {
    groupName: 'addType',
    groupLabel: 'Add Collaborator Method',
    info: 'Add collaborators one at a time or in bulk',
    required: true,
    inputs: [
      {
        label: 'Individual',
        value: 'individual',
        moreInfo: 'Add any user individually',
      },
      {
        label: 'Bulk',
        value: 'bulk',
        moreInfo:
          'Add all students from assignment and/or all owners of child workspaces',
      },
    ],
  };

  get isNoActionToTake() {
    return this.isBulkAdd && !this.areUsersToAdd;
  }
  collabsToAdd = [];

  get childWorkspaceOwners() {
    const workspaces = this.args.childWorkspaces || [];
    return workspaces.map((ws) => ws.belongsTo('owner').value());
  }

  get usersToAdd() {
    const existingCollabs = this.args.workspace.collaborators || [];
    const users = this.combinedUsers || [];
    const ownerId = this.args.workspace.belongsTo('owner').id();
    // NOTE: the workspace model has no `creator` relationship, so this stays
    // undefined — preserving the original `.get('creator.id')` behavior (the
    // creator check was always a no-op). belongsTo('creator') would throw.
    const creatorId = this.args.workspace.creator?.id;
    return users.filter((user) => {
      if (ownerId === user.id || creatorId === user.id) {
        return false;
      }
      return !existingCollabs.includes(user.id);
    });
  }

  // Combine passed students with child-workspace owners without mutating the
  // students arg (the classic version called addObjects on it in place).
  get combinedUsers() {
    const students = this.args.students || [];
    const owners = this.childWorkspaceOwners || [];
    const combined = [...students];
    owners.forEach((owner) => {
      if (owner && !combined.includes(owner)) {
        combined.push(owner);
      }
    });
    return combined;
  }

  @action updateAddType(val) {
    this.addType = val;
  }
  @action updateGlobalPermissionValue(val) {
    this.globalPermissionValue = val;
  }
  @action clearMissingUserError() {
    this.missingUserError = false;
  }
  @action clearExistingUserError() {
    this.existingUserError = false;
  }
  @action setCollab(val) {
    if (!val) {
      return;
    }
    const existingCollab = this.args.workspace.collaborators || [];
    const user = this.store.peekRecord('user', val);
    const alreadyCollab = existingCollab.includes(user.id);

    if (alreadyCollab) {
      this.existingUserError = true;
      return;
    }
    if (this.utils.isNonEmptyObject(user)) {
      this.collabsToAdd = [user];
    }
  }

  @action saveCollab() {
    const collabs = this.collabsToAdd;
    if (!this.utils.isNonEmptyArray(collabs)) {
      return (this.missingUserError = true);
    }
    const ws = this.args.workspace;
    const permissions = ws.permissions;

    // Create new permissions array with new collaborators
    const newPermissions = Array.isArray(permissions) ? [...permissions] : [];

    collabs.forEach((collab) => {
      newPermissions.push({
        user: collab.id,
        global: 'custom',
        submissions: { all: true, userOnly: false, submissionIds: [] },
        folders: 1,
        selections: 1,
        feedback: 'approver', // this is a workaround for collabs of a parent workspace to be able to see all of the responses. even tho the setting is approver, they will not be able to modify any responses for this workspace
      });
    });

    ws.permissions = newPermissions;
    // Update the parent-owned collaborators array in place (the arg is
    // read-only, so we can't reassign it).
    if (Array.isArray(this.args.originalCollaborators)) {
      this.args.originalCollaborators.addObjects(collabs);
    }

    ws.save().then(() => {
      this.alert.showToast(
        'success',
        `Collaborators Added`,
        'bottom-end',
        3000,
        null,
        false
      );
      this.args.cancelEditCollab();
    });
  }
  @action cancelCreateCollab() {
    this.args.cancelEditCollab();
  }
}
