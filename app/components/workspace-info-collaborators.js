import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service('current-user'),
  elementId: ['workspace-info-collaborators'],
  store: service(),
  utils: service('utility-methods'),
  alert: service('sweet-alert'),
  isParentWorkspace: equal('workspace.workspaceType', 'parent'),
  globalPermissionValue: null,
  showCustom: equal('globalPermissionValue', 'custom'),
  globalItems: {
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
      {
        label: 'Custom',
        value: 'custom',
        moreInfo:
          'Select this if you want to set permissions for each aspect of a workspace',
      },
    ],
  },
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
  feedbackPermissions: [
    {
      id: 1,
      display: 'None',
      value: 'none',
    },
    {
      id: 2,
      display: 'Approval Required',
      value: 'authReq',
    },
    {
      id: 3,
      display: 'Pre-Approved',
      value: 'preAuth',
    },
    {
      id: 4,
      display: 'Approver',
      value: 'approver',
    },
  ],
  submissionPermissions: [
    {
      id: 1,
      display: 'All',
      value: 'all',
    },
    {
      id: 2,
      display: 'Own Only',
      value: 'userOnly',
    },
    {
      id: 3,
      display: 'Custom',
      value: 'custom',
    },
  ],

  modes: computed(
    'currentUser.user.isAdmin',
    'currentUser.user.isStudent',
    function () {
      const basic = ['private', 'org', 'public'];

      if (
        this.get('currentUser.user.isStudent') ||
        !this.get('currentUser.user.isAdmin')
      ) {
        return basic;
      }

      return ['private', 'org', 'public', 'internet'];
    }
  ),

  workspacePermissions: computed(
    'workspace.permissions.[]',
    'originalCollaborators.[]',
    function () {
      let permissions = this.get('workspace.permissions');
      let collabs = this.originalCollaborators;

      if (!this.utils.isNonEmptyArray(permissions)) {
        return [];
      }
      //for each permissions object replace the userId with the user object
      //start with array of object and return array of objects
      if (this.utils.isNonEmptyArray(collabs)) {
        return permissions.map((permission) => {
          permission.userObj = this.store.peekRecord('user', permission.user);
          return permission;
        });
      }
      return [];
    }
  ),

  createValueObject(val) {
    let obj = {
      id: null,
      display: null,
      value: val,
    };
    switch (val) {
      case 0:
        obj.display = 'Hidden';
        obj.id = 1;
        break;
      case 1:
        obj.display = 'View Only';
        obj.id = 2;
        break;
      case 2:
        obj.display = 'Create';
        obj.id = 3;
        break;
      case 3:
        obj.display = 'Add';
        obj.id = 4;
        break;
      case 4:
        obj.display = 'Delete';
        obj.id = 5;
        break;
      case 'none':
        obj.display = 'None';
        obj.id = 1;
        break;
      case 'authReq':
        obj.display = 'Approval Required';
        obj.id = 2;
        break;
      case 'preAuth':
        obj.display = 'Pre-Approved';
        obj.id = 3;
        break;
      case 'approver':
        obj.display = 'Approver';
        obj.id = 4;
        break;
      default:
        break;
    }
    return obj;
  },

  createSubmissionValueObject(subObj) {
    let obj = {
      id: null,
      display: null,
      value: null,
    };
    if (subObj.all) {
      obj.id = 1;
      obj.value = 'all';
      obj.display = 'All';
    } else if (subObj.userOnly) {
      obj.id = 2;
      obj.value = 'userOnly';
      obj.display = 'Own Only';
    } else {
      obj.id = 3;
      obj.value = 'custom';
      obj.display = 'Custom';
      this.set('customSubIds', subObj.submissionIds);
    }
    return obj;
  },

  buildCustomSubmissionIds(submissionsValue) {
    if (submissionsValue === 'custom') {
      let ids = this.customSubmissionIds;
      if (this.utils.isNonEmptyArray(ids)) {
        return ids;
      }
      return [];
    }
    // } else if (submissionsValue === 'userOnly') {
    //   // filter for only submissions that have selectedUser as student
    //   const subs = this.get('workspace.submissions.content');
    //   const selectedUsername = this.get('selectedUser.username');
    //   const selectedUserId = this.get('selectedUser.id');
    //   if (subs) {
    //     const filtered = subs.filter((sub) => {
    //       return sub.get('creator.studentId') === selectedUserId || sub.get('creator.username') === selectedUsername;
    //     });
    //     return filtered.mapBy('id');
    //   }
    // }
    return [];
  },

  actions: {
    updateGlobalPermissionValue: function (val) {
      this.set('globalPermissionValue', val);
    },
    editCollab: function (collaborator) {
      this.set('isEditing', true);
      if (!this.utils.isNonEmptyObject(collaborator)) {
        return;
      }
      this.set('selectedCollaborator', collaborator.userObj);
      this.set('globalPermissionValue', collaborator.global);

      let submissions = this.createSubmissionValueObject(
        collaborator.submissions
      );
      let selections = this.createValueObject(collaborator.selections);
      let comments = this.createValueObject(collaborator.comments);
      let folders = this.createValueObject(collaborator.folders);
      let feedback = this.createValueObject(collaborator.feedback);
      let customSubIds = collaborator.submissions.submissionIds;
      this.set('submissions', submissions);
      this.set('customSubmissionIds', customSubIds);
      this.set('selections', selections);
      this.set('comments', comments);
      this.set('folders', folders);
      this.set('feedback', feedback);
    },

    savePermissions(permissionsObject) {
      const ws = this.workspace;
      if (!this.utils.isNonEmptyObject(permissionsObject)) {
        return;
      }
      const permissions = this.get('workspace.permissions');
      let existingObj = permissions.findBy('user', permissionsObject.user);

      this.set('selectedUser', permissionsObject.userObj);

      if (existingObj) {
        permissions.removeObject(existingObj);
      }

      let subValue = this.get('submissions.value');

      let newObj = {
        user: existingObj.user,
        global: this.globalPermissionValue,
        submissions: { all: false, userOnly: false, submissionIds: [] },
      };

      let globalSetting = this.globalPermissionValue;
      if (globalSetting === 'viewOnly') {
        newObj.folders = 1;
        newObj.selections = 1;
        newObj.comments = 1;
        newObj.feedback = 'none';
        newObj.submissions.all = true;
      }

      if (globalSetting === 'editor') {
        newObj.folders = 3;
        newObj.selections = 4;
        newObj.comments = 4;
        newObj.feedback = 'none';
        newObj.submissions.all = true;
      }

      if (globalSetting === 'indirectMentor') {
        newObj.folders = 2;
        newObj.selections = 2;
        newObj.comments = 2;
        newObj.feedback = 'authReq';
        newObj.submissions.all = true;
      }

      if (globalSetting === 'directMentor') {
        newObj.folders = 2;
        newObj.selections = 2;
        newObj.comments = 2;
        newObj.feedback = 'preAuth';
        newObj.submissions.all = true;
      }

      if (globalSetting === 'approver') {
        newObj.folders = 3;
        newObj.selections = 4;
        newObj.comments = 4;
        newObj.feedback = 'approver';
        newObj.submissions.all = true;
      }
      if (globalSetting === 'custom') {
        newObj.selections = this.get('selections.value');
        newObj.folders = this.get('folders.value');
        newObj.comments = this.get('comments.value');
        newObj.feedback = this.get('feedback.value');

        if (subValue === 'all') {
          newObj.submissions.all = true;
        } else if (subValue === 'userOnly') {
          newObj.submissions.userOnly = true;
        } else if (subValue === 'custom') {
          newObj.submissions.submissionIds = this.customSubmissionIds;
        }
      }
      permissions.addObject(newObj);

      ws.save().then(() => {
        this.set('globalPermissionValue', null);
        this.alert.showToast(
          'success',
          `Permissions set for ${permissionsObject.userObj.get('username')}`,
          'bottom-end',
          3000,
          null,
          false
        );
        this.set('selectedCollaborator', null);
        this.set('selectedUser', null);
      });
    },

    removeCollab(user) {
      let workspace = this.workspace;
      const utils = this.utils;

      if (!utils.isNonEmptyObject(user)) {
        return;
      }
      const permissions = this.get('workspace.permissions');

      if (utils.isNonEmptyArray(permissions)) {
        const objToRemove = permissions.findBy('user', user.get('id'));
        if (objToRemove) {
          let userDisplay = user.get('username');
          let pronoun = 'their';

          let isSelf = user.get('id') === this.get('currentUser.user.id');

          if (isSelf) {
            userDisplay = 'yourself';
            pronoun = 'your';
          }

          this.alert
            .showModal(
              'warning',
              `Are you sure you want to remove ${userDisplay} as a collaborator?`,
              `This may affect ${pronoun} ability to access ${this.get(
                'workspace.name'
              )} `,
              'Yes, remove'
            )
            .then((result) => {
              if (result.value) {
                permissions.removeObject(objToRemove);
                const collaborators = this.originalCollaborators;
                collaborators.removeObject(user);
                workspace.save().then(() => {
                  this.alert.showToast(
                    'success',
                    `${user.get('username')} removed`,
                    'bottom-end',
                    3000,
                    null,
                    false
                  );
                });
              }
            });
        }
      }
    },

    addCollaborator: function () {
      this.set('createNewCollaborator', true);
    },
    toggleSubmissionView: function () {
      this.toggleIsShowingCustomViewer();
    },
    cancelEditCollab: function () {
      this.set('selectedCollaborator', null);
      if (this.isShowingCustomViewer) {
        this.toggleIsShowingCustomViewer();
      }
    },
  },
});
