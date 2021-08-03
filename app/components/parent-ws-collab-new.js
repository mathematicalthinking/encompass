import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { equal, gt } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  elementId: ['parent-ws-collab-new'],
  utils: service('utility-methods'),
  alert: service('sweet-alert'),
  globalPermissionValue: 'viewOnly',
  addType: 'individual',
  areUsersToAdd: gt('usersToAdd.length', 0),

  isBulkAdd: equal('addType', 'bulk'),

  mainPermissions: [
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
  ],

  globalItems: {
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
  },

  addTypeItems: {
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
  },

  isNoActionToTake: computed('isBulkAdd', 'areUsersToAdd', function () {
    return this.isBulkAdd && !this.areUsersToAdd;
  }),

  init() {
    this.set('collabsToAdd', []);
    this._super(...arguments);
  },

  willDestroyElement() {
    this.set('collabsToAdd', null);
    this._super(...arguments);
  },

  childWorkspaceOwners: computed('childWorkspaces.@each.owner', function () {
    let workspaces = this.childWorkspaces || [];
    return workspaces.map((ws) => {
      return ws.get('owner.content');
    });
  }),

  usersToAdd: computed(
    'combinedUsers.[]',
    'workspace.collaborators.[]',
    function () {
      let existingCollabs = this.workspace.collaborators || [];
      let users = this.combinedUsers || [];
      let ownerId = this.workspace.owner.id;
      let creatorId = this.workspace.creator.id;
      return users.filter((user) => {
        if (ownerId === user.get('id') || creatorId === user.get('id')) {
          return false;
        }
        return !existingCollabs.includes(user.get('id'));
      });
    }
  ),

  combinedUsers: computed(
    'students.[]',
    'childWorkspaceOwners.[]',
    function () {
      return this.students.addObjects(this.childWorkspaceOwners);
    }
  ),

  actions: {
    setCollab(val, $item) {
      if (!val) {
        return;
      }
      let existingCollab = this.workspace.collaborators;
      const user = this.store.peekRecord('user', val);
      let alreadyCollab = _.contains(existingCollab, user.get('id'));

      if (alreadyCollab) {
        this.set('existingUserError', true);
        return;
      }
      if (this.utils.isNonEmptyObject(user)) {
        this.set('collabsToAdd', [user]);
      }
    },

    saveCollab() {
      let collabs = this.collabsToAdd;
      if (!this.utils.isNonEmptyArray(collabs)) {
        return this.set('missingUserError', true);
      }
      let ws = this.workspace;
      let permissions = ws.get('permissions');

      collabs.forEach((collab) => {
        this.originalCollaborators.addObject(collab);
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
        this.set('createNewCollaborator', false);
      });
    },
    cancelCreateCollab: function () {
      this.set('createNewCollaborator', null);
      if (this.isShowingCustomViewer) {
        this.set('isShowingCustomViewer', false);
      }
    },
  },
});
