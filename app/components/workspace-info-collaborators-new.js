import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class WorkspaceInfoCollaboratorsNewComponent extends Component {
  @service('utility-methods') utils;
  @service('sweet-alert') alert;
  @service store;
  @tracked globalPermissionValue = 'viewOnly';
  @tracked existingUserError = false;
  @tracked missingUserError = false;
  @tracked collabUser = {};
  @tracked submissions = null;
  @tracked selections = null;
  @tracked folders = null;
  @tracked comments = null;
  @tracked feedback = null;
  get showCustom() {
    return this.globalPermissionValue === 'custom';
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
  feedbackPermissions = [
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

  @action updateGlobalPermissionValue(val) {
    this.globalPermissionValue = val;
  }
  @action setSubmissions(val) {
    this.submissions = val;
  }
  @action setSelections(val) {
    this.selections = val;
  }
  @action setComments(val) {
    this.comments = val;
  }
  @action setFolders(val) {
    this.folders = val;
  }
  @action setFeedback(val) {
    this.feedback = val;
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
    const existingCollab = this.args.workspace.collaborators;
    const user = this.store.peekRecord('user', val);
    const alreadyCollab = existingCollab.includes(user.id);

    if (alreadyCollab) {
      this.existingUserError = true;
      return;
    }
    if (this.utils.isNonEmptyObject(user)) {
      this.collabUser = user;
    }
  }

  @action saveCollab() {
    if (!this.collabUser) {
      this.missingUserError = true;
      return;
    }
    let ws = this.args.workspace;
    let permissions = ws.permissions;

    let newObj = {
      user: this.collabUser.id,
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
      let subValue = this.submissions.value;
      newObj.selections = this.selections.value || 0;
      newObj.folders = this.folders.value || 0;
      newObj.comments = this.comments.value || 0;
      newObj.feedback = this.feedback.value || 'none';

      if (subValue === 'all') {
        newObj.submissions.all = true;
      } else if (subValue === 'userOnly') {
        newObj.submissions.userOnly = true;
      } else if (subValue === 'custom') {
        // Convert Ember array to plain array to avoid circular ref
        newObj.submissions.submissionIds = Array.isArray(
          this.args.customSubmissionIds
        )
          ? [...this.args.customSubmissionIds]
          : [];
      }
    }
    this.args.originalCollaborators.addObject(this.collabUser);

    // Add the new permission object to the existing permissions
    const newPermissions = Array.isArray(permissions)
      ? [...permissions, newObj]
      : [newObj];

    ws.permissions = newPermissions;

    ws.save().then(() => {
      this.alert.showToast(
        'success',
        `${this.collabUser.username} added as collaborator`,
        'bottom-end',
        3000,
        null,
        false
      );
      this.args.cancelEditCollab();
    });
  }
  @action toggleSubmissionView() {
    this.args.toggleIsShowingCustomViewer();
  }
  @action cancelCreateCollab() {
    this.args.cancelEditCollab();
  }
}
