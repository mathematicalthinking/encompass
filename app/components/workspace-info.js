import Component from '@ember/component';
// import { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  tagName: '',
  elementId: 'workspace-info',
  // comments: controller(),
  alert: service('sweet-alert'),
  permissions: service('workspace-permissions'),
  utils: service('utility-methods'),
  isEditing: false,
  selectedMode: null,
  updateRecordErrors: () => [],
  isShowingCustomViewer: false,
  customSubmissionIds: () => [],
  isParentWorkspace: equal('workspace.workspaceType', 'parent'),

  didReceiveAttrs() {
    this._super(...arguments);

    const collaborators = this.workspace.collaborators;
    // array of Ids, query for users;

    if (!this.utils.isNonEmptyArray(collaborators)) {
      this.set('originalCollaborators', []);
      return;
    }

    return this.store
      .query('user', {
        ids: collaborators,
      })
      .then((users) => {
        this.set('originalCollaborators', users.toArray());
      })
      .catch((err) => {
        this.handleErrors(err, 'queryErrors');
      });
  },

  getLinkedAssignment: function () {
    return this.workspace.linkedAssignment.then((assignment) => {
      if (!this.isDestroyed && !this.isDestroying) {
        this.set('linkedAssignment', assignment);
      }
    });
  },

  willDestroyElement: function () {
    let workspace = this.workspace;
    workspace.save();
    this._super(...arguments);
  },

  canEdit: computed('currentUser', 'workspace.id', function () {
    let workspace = this.workspace;
    let ownerId = workspace.get('owner.id');
    let creatorId = workspace.get('createdBy.id');
    let currentUser = this.currentUser;
    let accountType = currentUser.get('accountType');
    let isAdmin = accountType === 'A';
    let isOwner = ownerId === currentUser.id;
    let isCreator = creatorId === currentUser.id;

    return isAdmin || isOwner || isCreator;
  }),

  canEditCollaborators: computed(
    'canEdit',
    'currentUser.id',
    'workspace.feedbackAuthorizers.[]',
    function () {
      if (this.canEdit) {
        return true;
      }
      return this.workspace.feedbackAuthorizers.includes(this.currentUser.id);
    }
  ),

  showRemoveSelfAsCollab: computed(
    'currentUser.id',
    'workspace.collaborators.[]',
    function () {
      return this.workspace.collaborators.includes(this.currentUser.id);
    }
  ),

  modes: computed('currentUser.isAdmin', 'currentUser.isStudent', function () {
    const basic = ['private', 'org', 'public'];

    if (this.currentUser.isStudent || !this.currentUser.isAdmin) {
      return basic;
    }

    return ['private', 'org', 'public', 'internet'];
  }),

  globalItems: () => ({
    groupName: 'globalPermissionValue',
    groupLabel: 'Workspace Permissions',
    info:
      'Workspace permissions apply to all aspects of a workspace for this user. This means whatever you select applies to all the selections, comments, folders, etc.',
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
      {
        label: 'Custom',
        value: 'custom',
        moreInfo:
          'Select this if you want to set permissions for each aspect of a workspace',
      },
    ],
  }),

  initialCollabOptions: computed('selectedCollaborators', 'store', function () {
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

  selectedCollaborators: computed(
    'originalCollaborators.[]',
    'workspace.owner.id',
    function () {
      let hash = {};
      let wsOwnerId = this.workspace.owner.id;

      // no reason to set owner as a collaborator
      if (wsOwnerId) {
        hash[wsOwnerId] = true;
      }
      const originalCollaborators = this.originalCollaborators;

      if (!this.utils.isNonEmptyArray(originalCollaborators)) {
        return hash;
      }
      originalCollaborators.forEach((user) => {
        if (_.isString(user)) {
          hash[user] = true;
        } else if (_.isObject(user)) {
          hash[user.get('id')] = true;
        }
      });
      return hash;
    }
  ),

  actions: {
    removeCollab(user) {
      const utils = this.utils;
      if (!utils.isNonEmptyObject(user)) {
        return;
      }
      const permissions = this.workspacePermissions;

      if (utils.isNonEmptyArray(permissions)) {
        const objToRemove = permissions.findBy('user', user.id);
        if (objToRemove) {
          this.alert
            .showModal(
              'warning',
              `Are you sure you want to remove ${user.get(
                'username'
              )} as a collaborator?`,
              `This may affect their ability to access ${this.workspace.name} `,
              'Yes, remove.'
            )
            .then((result) => {
              if (result.value) {
                permissions.removeObject(objToRemove);
                const collaborators = this.originalCollaborators;
                collaborators.removeObject(user);
                // this.alert').showToast('success', `${user.get('username} removed`, 'bottom-end', 3000, null, false);
                // remove workspace from user's collab workspaces
              }
            });
        }
      }
    },
    savePermissions(permissionsObject) {
      if (!this.utils.isNonEmptyObject(permissionsObject)) {
        return;
      }
      const permissions = this.workspacePermissions;

      // array of user records for display purposes
      const collaborators = this.originalCollaborators;
      // check if user already is in array
      let existingObj = permissions.findBy('user', permissionsObject.user.id);

      // remove existing permissions obj and add modified one
      if (existingObj) {
        permissions.removeObject(existingObj);
      }
      collaborators.addObject(permissionsObject.user);

      // eslint-disable-next-line prefer-object-spread
      let copy = Object.assign({}, permissionsObject);

      copy.user = copy.user.id;
      permissions.addObject(copy);

      // clear selectedCollaborator
      // clear selectize input

      this.set('selectedCollaborator', null);
      this.$('select#collab-select')[0].selectize.clear();

      this.alert.showToast(
        'success',
        `Permissions set for ${permissionsObject.user.get('username')}`,
        'bottom-end',
        3000,
        null,
        false
      );
    },

    editCollab: function (user) {
      if (!this.utils.isNonEmptyObject(user)) {
        return;
      }
      this.set('selectedCollaborator', user);
    },

    editOwner: function () {
      this.set('isChangingOwner', true);
    },

    editWorkspace: function () {
      this.set('isEditing', true);
      let workspace = this.workspace;
      this.set('selectedMode', workspace.get('mode'));
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
      this.set('isEditing', false);
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
        })
        .catch((err) => {
          this.handleErrors(err, 'updateRecordErrors', workspace);
        });
    },

    removeErrorString: function (arrayPropName, errorString) {
      let errors = this.get(arrayPropName);
      if (Array.isArray(errors)) {
        errors.removeObject(errorString);
      }
    },
    updateCustomSubs(id) {
      if (!this.utils.isNonEmptyArray(this.customSubmissionIds)) {
        this.set('customSubmissionIds', []);
      }
      const customSubmissionIds = this.customSubmissionIds;

      const isIn = customSubmissionIds.includes(id);
      if (isIn) {
        customSubmissionIds.removeObject(id);
      } else {
        customSubmissionIds.addObject(id);
      }
    },
    selectAllSubmissions: function () {
      this.set('customSubmissionIds', this.workspace.submissions.mapBy('id'));
    },
    deselectAllSubmissions: function () {
      this.set('customSubmissionIds', []);
    },
  },
});
