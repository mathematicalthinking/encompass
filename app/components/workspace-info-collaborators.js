import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WorkspaceInfoCollaborators extends Component {
  @service('current-user') currentUser;
  @service store;
  @service('utility-methods') utils;
  @service('sweet-alert') alert;
  get isParentWorkspace() {
    return this.args.workspace.workspaceType === 'parent';
  }
  @tracked globalPermissionValue = null;
  @tracked isEditing = false;
  @tracked submissions = null;
  @tracked customSubmissionIds = null;
  @tracked selections = null;
  @tracked comments = null;
  @tracked folders = null;
  @tracked feedback = null;
  @tracked selectedUser = null;
  @tracked selectedCollaborator = null;
  @tracked createNewCollaborator = false;
  @tracked customSubIds = [];
  get showCustom() {
    return this.globalPermissionValue === 'custom';
  }
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
      {
        label: 'Custom',
        value: 'custom',
        moreInfo:
          'Select this if you want to set permissions for each aspect of a workspace',
      },
    ],
  };
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
  feedbackPermission = [
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
  ];
  submissionPermissions = [
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
  ];

  get modes() {
    const basic = ['private', 'org', 'public'];

    if (this.currentUser.user.isStudent || !this.currentUser.user.isAdmin) {
      return basic;
    }

    return ['private', 'org', 'public', 'internet'];
  }

  get workspacePermissions() {
    let permissions = this.args.workspace.get('permissions');
    let collabs = this.args.originalCollaborators;

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
  }

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
      this.customSubIds = subObj.submissionIds;
    }
    return obj;
  }

  buildCustomSubmissionIds(submissionsValue) {
    if (submissionsValue === 'custom') {
      let ids = this.args.customSubmissionIds;
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
  }

  @action updateGlobalPermissionValue(val) {
    this.globalPermissionValue = val;
  }

  @action editCollab(collaborator) {
    this.isEditing = true;
    if (!this.utils.isNonEmptyObject(collaborator)) {
      return;
    }
    this.selectedCollaborator = collaborator.userObj;
    this.globalPermissionValue = collaborator.global;

    let submissions = this.createSubmissionValueObject(
      collaborator.submissions
    );
    let selections = this.createValueObject(collaborator.selections);
    let comments = this.createValueObject(collaborator.comments);
    let folders = this.createValueObject(collaborator.folders);
    let feedback = this.createValueObject(collaborator.feedback);
    let customSubIds = collaborator.submissions.submissionIds;
    this.submissions = submissions;
    this.customSubmissionIds = customSubIds;
    this.selections = selections;
    this.comments = comments;
    this.folders = folders;
    this.feedback = feedback;
  }

  @action savePermissions(permissionsObject) {
    const ws = this.args.workspace;
    if (!this.utils.isNonEmptyObject(permissionsObject)) {
      return;
    }
    const permissions = this.args.workspace.get('permissions');
    let existingObj = permissions.findBy('user', permissionsObject.user);

    this.selectedUser = permissionsObject.userObj;

    if (existingObj) {
      permissions.removeObject(existingObj);
    }

    let subValue = this.submissions.value;

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
      newObj.selections = this.selections.value;
      newObj.folders = this.folders.value;
      newObj.comments = this.comments.value;
      newObj.feedback = this.feedback.value;

      if (subValue === 'all') {
        newObj.submissions.all = true;
      } else if (subValue === 'userOnly') {
        newObj.submissions.userOnly = true;
      } else if (subValue === 'custom') {
        newObj.submissions.submissionIds = this.args.customSubmissionIds;
      }
    }
    permissions.addObject(newObj);

    ws.save().then(() => {
      this.globalPermissionValue = null;
      this.alert.showToast(
        'success',
        `Permissions set for ${permissionsObject.userObj.get('username')}`,
        'bottom-end',
        3000,
        null,
        false
      );
      this.selectedCollaborator = null;
      this.selectedUser = null;
    });
  }

  @action removeCollab(user) {
    let workspace = this.args.workspace;
    const utils = this.utils;

    if (!utils.isNonEmptyObject(user)) {
      return;
    }
    const permissions = this.args.workspace.get('permissions');

    if (utils.isNonEmptyArray(permissions)) {
      const objToRemove = permissions.findBy('user', user.get('id'));
      if (objToRemove) {
        let userDisplay = user.get('username');
        let pronoun = 'their';

        let isSelf = user.get('id') === this.currentUser.user.id;

        if (isSelf) {
          userDisplay = 'yourself';
          pronoun = 'your';
        }

        this.alert
          .showModal(
            'warning',
            `Are you sure you want to remove ${userDisplay} as a collaborator?`,
            `This may affect ${pronoun} ability to access ${this.args.workspace.name} `,
            'Yes, remove'
          )
          .then((result) => {
            if (result.value) {
              permissions.removeObject(objToRemove);
              const collaborators = this.args.originalCollaborators;
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
  }
  @action addCollaborator() {
    this.createNewCollaborator = true;
  }
  @action toggleSubmissionView() {
    this.args.toggleIsShowingCustomViewer();
  }
  @action cancelEditCollab() {
    this.createNewCollaborator = false;
    this.selectedCollaborator = null;
    if (this.args.isShowingCustomViewer) {
      this.args.toggleIsShowingCustomViewer();
    }
  }
}
