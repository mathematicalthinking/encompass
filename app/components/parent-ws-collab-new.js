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
    let workspaces = this.args.childWorkspaces || [];
    return workspaces.map((ws) => {
      return ws.get('owner.content');
    });
  }

  get usersToAdd() {
    let existingCollabs = this.args.workspace.get('collaborators') || [];
    let users = this.combinedUsers || [];
    let ownerId = this.args.workspace.get('owner.id');
    let creatorId = this.args.workspace.get('creator.id');
    return users.filter((user) => {
      if (ownerId === user.get('id') || creatorId === user.get('id')) {
        return false;
      }
      return !existingCollabs.includes(user.get('id'));
    });
  }

  get combinedUsers() {
    return this.args.students.addObjects(this.childWorkspaceOwners);
  }

  @action updateAddType(val) {
    this.addType = val;
  }
  @action updateGlobalPermissionValue(val) {
    this.globalPermissionValue = val;
  }
  @action setCollab(val) {
    if (!val) {
      return;
    }
    let existingCollab = this.args.workspace.get('collaborators') || [];
    const user = this.store.peekRecord('user', val);
    let alreadyCollab = existingCollab.includes(user.get('id'));

    if (alreadyCollab) {
      this.existingUserError = true;
      return;
    }
    if (this.utils.isNonEmptyObject(user)) {
      this.collabsToAdd = [user];
    }
  }

  @action saveCollab() {
    let collabs = this.collabsToAdd;
    if (!this.utils.isNonEmptyArray(collabs)) {
      return (this.missingUserError = true);
    }
    let ws = this.args.workspace;
    let permissions = ws.get('permissions');

    collabs.forEach((collab) => {
      this.args.originalCollaborators.addObject(collab);
      permissions.addObject({
        user: collab.get('id'),
        global: 'custom',
        submissions: { all: true, userOnly: false, submissionIds: [] },
        folders: 1,
        selections: 1,
        feedback: 'approver', // this is a workaround for collabs of a parent workspace to be able to see all of the responses. even tho the setting is approver, they will not be able to modify any responses for this workspace
      });
    });

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
