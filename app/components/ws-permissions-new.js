import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import each from 'lodash-es/each';
import isArray from 'lodash-es/isArray';

export default class WsPermissionsNewComponent extends Component {
  @service('utility-methods') utils;

  @tracked global = 'viewOnly';
  @tracked submissions = 'all';
  @tracked comments = 1;
  @tracked selections = 1;
  @tracked feedback = 'authReq';
  @tracked folders = 1;
  @tracked customSubmissionIds = [];
  @tracked showCustomSubmissionViewer = true;
  @tracked saveError = null;

  submissionItems = {
    groupName: 'submissions',
    groupLabel: 'Accessible Submissions',
    info: 'Accessible submissions dictate what submissions this user will see in the workspace. Hover over the question marks for more info',
    required: true,
    inputs: [
      { label: 'All', value: 'all' },
      {
        label: 'Own Only',
        value: 'userOnly',
        moreInfo:
          'If the user is the creator of any submission in this workspace, they will only see those',
      },
      {
        label: 'Custom',
        value: 'custom',
        moreInfo:
          'View all submissions and select specific ones this user can see',
      },
    ],
  };

  folderItems = {
    groupName: 'folders',
    groupLabel: 'Folder Permissions',
    info: 'Folder permissions decide what users can do with folders in this workspace. Delete is the highest setting which means this user can do anything related to folders',
    required: true,
    inputs: [
      { label: 'None', value: 0, moreInfo: 'User will see no folders' },
      {
        label: 'View Only',
        value: 1,
        moreInfo: 'User will be able to see folders',
      },
      {
        label: 'Create',
        value: 2,
        moreInfo: 'User will be able to create new folders ',
      },
      {
        label: 'Modify',
        value: 3,
        moreInfo:
          'User will be able to rename, reorder, and delete existing folders',
      },
    ],
  };

  selectionItems = {
    groupName: 'selections',
    groupLabel: 'Selection Permissions',
    info: 'Selection permissions decide what users can do with selections in this workspace. Delete is the highest setting which means this user can do anything related to selections. If you can create selections, you can file them in any available folders.',
    required: true,
    inputs: [
      { label: 'None', value: 0, moreInfo: 'User will see no selections' },
      {
        label: 'View Only',
        value: 1,
        moreInfo: 'User will be able to see selections',
      },
      {
        label: 'Create',
        value: 2,
        moreInfo: 'User will be able to see and add selections ',
      },
      {
        label: 'Edit',
        value: 3,
        moreInfo: 'User will be able to see, add, and edit selections',
      },
      {
        label: 'Delete',
        value: 4,
        moreInfo: 'User will be able to see, add, edit, and delete selections',
      },
    ],
  };

  commentItems = {
    groupName: 'comments',
    groupLabel: 'Comment Permissions',
    info: 'Comment permissions decide what users can do with comments in this workspace. Delete is the highest setting which means this user can do anything related to comments',
    required: true,
    inputs: [
      { label: 'None', value: 0, moreInfo: 'User will see no comments' },
      {
        label: 'View Only',
        value: 1,
        moreInfo: 'User will be able to see comments',
      },
      {
        label: 'Create',
        value: 2,
        moreInfo: 'User will be able to see and add comments ',
      },
      {
        label: 'Edit',
        value: 3,
        moreInfo: 'User will be able to see, add, and edit comments',
      },
      {
        label: 'Delete',
        value: 4,
        moreInfo: 'User will be able to see, add, edit and delete comments',
      },
    ],
  };

  feedbackItems = {
    groupName: 'feedback',
    groupLabel: 'Feedback Permissions',
    info: 'Feedback permissions dictate whether this user can send feedback to the creator of the submissions. Hover over the question marks for more info.',
    required: true,
    inputs: [
      {
        label: 'None',
        value: 'none',
        moreInfo: 'User will not be able to see feedback',
      },
      {
        label: 'Approval Required',
        value: 'authReq',
        moreInfo:
          'User can send feeback but the owner will have to approve it first',
      },
      {
        label: 'Pre-approved',
        value: 'preAuth',
        moreInfo:
          'User can send feedback directly to students without approval',
      },
      {
        label: 'Feedback Approver',
        value: 'approver',
        moreInfo:
          'User can send feedback directly and approve other feedback that is pending approval',
      },
    ],
  };

  globalItems = {
    groupName: 'global',
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

  constructor() {
    super(...arguments);
    // prefill for editing an existing collaborator's permissions
    this.prefillFromPermissions();
    // let the parent know whether the custom submission viewer is showing
    this.syncSubView();
  }

  get showCustom() {
    return this.global === 'custom';
  }

  get showCustomSubmissions() {
    return this.submissions === 'custom' && this.showCustomSubmissionViewer;
  }

  get closedCustomView() {
    return this.submissions === 'custom' && !this.showCustomSubmissionViewer;
  }

  prefillFromPermissions() {
    const selectedUserId = this.args.selectedUser?.id;
    const permissions = this.args.permissions;
    const utils = this.utils;

    if (
      utils.isNullOrUndefined(selectedUserId) ||
      !utils.isNonEmptyArray(permissions)
    ) {
      return;
    }

    const userPermissions = permissions.find((obj) => {
      let user = obj.user;
      if (utils.isNonEmptyObject(user)) {
        return user.get('id') === selectedUserId;
      }
      return user === selectedUserId;
    });

    if (!utils.isNonEmptyObject(userPermissions)) {
      return;
    }

    each(
      ['folders', 'comments', 'selections', 'feedback', 'global'],
      (prop) => {
        let val = userPermissions[prop];
        if (!utils.isNullOrUndefined(val)) {
          this[prop] = val;
        }
      }
    );

    const submissions = userPermissions.submissions;
    if (utils.isNonEmptyObject(submissions)) {
      if (submissions.all === true) {
        this.submissions = 'all';
      } else if (submissions.userOnly === true) {
        this.submissions = 'userOnly';
      } else if (isArray(submissions.submissionIds)) {
        this.submissions = 'custom';
        this.customSubmissionIds = [...submissions.submissionIds];
      }
    }
  }

  syncSubView() {
    this.args.onSubViewChange?.(this.showCustomSubmissions);
  }

  // re-prefill when the edited collaborator changes without the component being
  // recreated (the collaborator list and this editor can be open at once), which
  // is what the classic didReceiveAttrs used to handle.
  @action
  prefillOnUserChange() {
    this.prefillFromPermissions();
    this.syncSubView();
  }

  buildCustomSubmissionIds(submissionsValue) {
    if (submissionsValue === 'custom') {
      let ids = this.customSubmissionIds;
      if (this.utils.isNonEmptyArray(ids)) {
        return ids;
      }
    }
    return [];
  }

  buildPermissionsObject() {
    const user = this.args.selectedUser;
    const globalSetting = this.global;
    const submissions = this.submissions;

    const includeAllSubs = submissions === 'all';
    const isUserOnly = submissions === 'userOnly';

    let submissionOptions = {
      all: includeAllSubs,
      userOnly: isUserOnly,
      submissionIds: [],
    };

    if (!includeAllSubs && !isUserOnly) {
      submissionOptions.submissionIds =
        this.buildCustomSubmissionIds(submissions);
    }

    const results = {
      user,
      submissions: submissionOptions,
      global: globalSetting,
    };

    if (globalSetting === 'viewOnly') {
      return {
        ...results,
        folders: 1,
        selections: 1,
        comments: 1,
        feedback: 'none',
      };
    }
    if (globalSetting === 'editor') {
      return {
        ...results,
        folders: 3,
        selections: 4,
        comments: 4,
        feedback: 'none',
      };
    }
    if (globalSetting === 'indirectMentor') {
      return {
        ...results,
        folders: 2,
        selections: 2,
        comments: 2,
        feedback: 'authReq',
      };
    }
    if (globalSetting === 'directMentor') {
      return {
        ...results,
        folders: 2,
        selections: 2,
        comments: 2,
        feedback: 'preAuth',
      };
    }
    if (globalSetting === 'approver') {
      return {
        ...results,
        folders: 3,
        selections: 4,
        comments: 4,
        feedback: 'approver',
      };
    }

    return {
      ...results,
      folders: this.folders,
      selections: this.selections,
      comments: this.comments,
      feedback: this.feedback,
    };
  }

  @action updateSubmissions(val) {
    this.submissions = val;
    this.syncSubView();
  }

  @action updateGlobal(val) {
    this.global = val;
  }

  @action updateSelections(val) {
    this.selections = val;
  }

  @action updateComments(val) {
    this.comments = val;
  }

  @action updateFolders(val) {
    this.folders = val;
  }

  @action updateFeedback(val) {
    this.feedback = val;
  }

  @action savePermissions() {
    if (this.saveError) {
      this.saveError = null;
    }
    const permissions = this.buildPermissionsObject();
    if (this.utils.isNonEmptyObject(permissions)) {
      this.args.onSave(permissions);
      return;
    }
    this.saveError = true;
  }

  @action updateCustomSubs(id) {
    const ids = this.utils.isNonEmptyArray(this.customSubmissionIds)
      ? this.customSubmissionIds
      : [];
    this.customSubmissionIds = ids.includes(id)
      ? ids.filter((existing) => existing !== id)
      : [...ids, id];
  }

  @action selectAllSubmissions() {
    this.customSubmissionIds = this.args.workspace.submissions.mapBy('id');
  }

  @action deselectAllSubmissions() {
    this.customSubmissionIds = [];
  }

  @action showViewer() {
    this.showCustomSubmissionViewer = true;
    this.syncSubView();
  }

  @action closeCustomSelect() {
    this.showCustomSubmissionViewer = false;
    this.syncSubView();
  }

  @action resetSaveError() {
    this.saveError = null;
  }
}
