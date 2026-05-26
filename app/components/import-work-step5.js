import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ImportWorkStep5Component extends Component {
  @service store;
  @service('utility-methods') utils;
  @service('sweet-alert') alert;

  @tracked doCreateWs = false;
  @tracked createAssignmentValue = false;
  @tracked selectedOwner = null;
  @tracked selectedFolderSet = null;
  @tracked selectedMode = 'private';
  @tracked workspaceName = null;
  @tracked assignmentName = null;
  @tracked missingNameError = null;
  @tracked missingOwnerError = null;
  @tracked missingAssignmentError = null;
  @tracked createWorkspaceError = null;

  createWsOptions = {
    groupName: 'createWs',
    required: true,
    inputs: [
      {
        value: true,
        label: 'Yes',
      },
      {
        value: false,
        label: 'No',
      },
    ],
  };

  createAssignmentOptions = {
    groupName: 'createAssignment',
    required: true,
    inputs: [
      {
        value: true,
        label: 'Yes',
      },
      {
        value: false,
        label: 'No',
      },
    ],
  };

  constructor(owner, args) {
    super(owner, args);
    this.doCreateWs = this.normalizeBooleanValue(args.doCreateWs);
    this.createAssignmentValue = this.normalizeBooleanValue(
      args.createAssignmentValue
    );
    this.selectedOwner = args.selectedOwner || null;
    this.selectedFolderSet = args.selectedFolderSet || null;
    this.selectedMode = args.selectedMode || 'private';
    this.workspaceName = this.normalizeTextValue(args.workspaceName);
    this.assignmentName = this.normalizeTextValue(args.assignmentName);
  }

  get creatingWs() {
    return this.doCreateWs === true;
  }

  get creatingAssignment() {
    return this.createAssignmentValue === true;
  }

  get currentUser() {
    return this.args.currentUser || null;
  }

  get selectedSection() {
    return this.args.selectedSection || null;
  }

  get ownerOptions() {
    let users = this.args.users;
    if (!users) {
      return [];
    }
    return users.map((user) => {
      const getValue =
        typeof user?.get === 'function'
          ? (prop) => user.get(prop)
          : (prop) => user?.[prop];
      return {
        id: getValue('id') || getValue('_id') || getValue('userId'),
        username: getValue('username') || '',
      };
    });
  }

  get folderSetOptions() {
    let folderSets = this.args.folderSets;
    if (!Array.isArray(folderSets)) {
      return [];
    }
    return folderSets.map((folderSet) => {
      const getValue =
        typeof folderSet?.get === 'function'
          ? (prop) => folderSet.get(prop)
          : (prop) => folderSet?.[prop];
      return {
        id: getValue('id') || getValue('_id'),
        name: getValue('name') || '',
      };
    });
  }

  get modeInputs() {
    const base = {
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

    if (this.currentUser?.isStudent || !this.currentUser?.isAdmin) {
      return base;
    }

    return {
      ...base,
      inputs: [
        ...base.inputs,
        {
          value: 'internet',
          label: 'Internet',
          moreInfo:
            'Workspace will be accesible to any user with a link to the workspace',
        },
      ],
    };
  }

  get initialOwnerItem() {
    if (this.utils.isNonEmptyObject(this.selectedOwner)) {
      const id = this.getRecordId(this.selectedOwner);
      return id ? [id] : [];
    }
    return [];
  }

  get initialFolderSetItem() {
    if (this.utils.isNonEmptyObject(this.selectedFolderSet)) {
      const id = this.getRecordId(this.selectedFolderSet);
      return id ? [id] : [];
    }
    return [];
  }

  getRecordId(record) {
    if (!record) {
      return null;
    }
    return (
      record.id ||
      record._id ||
      record.userId ||
      (typeof record.get === 'function'
        ? record.get('id') || record.get('_id') || record.get('userId')
        : null)
    );
  }

  isSameRecord(left, right) {
    const leftId = this.getRecordId(left);
    const rightId = this.getRecordId(right);
    if (leftId && rightId) {
      return String(leftId) === String(rightId);
    }
    return left === right;
  }

  normalizeTextValue(value) {
    return typeof value === 'string' ? value.trim() : value;
  }

  normalizeBooleanValue(value) {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'number') {
      return value === 1;
    }
    if (typeof value === 'string') {
      let normalized = value.trim().toLowerCase();
      return (
        normalized === 'true' || normalized === '1' || normalized === 'yes'
      );
    }
    return false;
  }

  buildReviewPayload(overrides = {}) {
    const doCreateWs =
      overrides.doCreateWs !== undefined
        ? this.normalizeBooleanValue(overrides.doCreateWs)
        : this.normalizeBooleanValue(this.doCreateWs);
    const createAssignmentValue =
      overrides.createAssignmentValue !== undefined
        ? this.normalizeBooleanValue(overrides.createAssignmentValue)
        : this.normalizeBooleanValue(this.createAssignmentValue);
    const selectedOwner =
      overrides.selectedOwner !== undefined
        ? overrides.selectedOwner
        : this.selectedOwner;
    const selectedFolderSet =
      overrides.selectedFolderSet !== undefined
        ? overrides.selectedFolderSet
        : this.selectedFolderSet;
    const selectedMode =
      overrides.selectedMode !== undefined
        ? overrides.selectedMode
        : this.selectedMode || 'private';
    const workspaceNameRaw =
      overrides.workspaceName !== undefined
        ? overrides.workspaceName
        : this.workspaceName;
    const assignmentNameRaw =
      overrides.assignmentName !== undefined
        ? overrides.assignmentName
        : this.assignmentName;

    const workspaceName = this.normalizeTextValue(workspaceNameRaw);
    const assignmentName = this.normalizeTextValue(assignmentNameRaw);

    return {
      doCreateWs: doCreateWs === true,
      createAssignmentValue: createAssignmentValue === true,
      selectedOwner: selectedOwner || null,
      selectedFolderSet: selectedFolderSet || null,
      selectedMode: selectedMode || 'private',
      workspaceName: doCreateWs ? workspaceName || null : null,
      workspaceOwner: doCreateWs ? selectedOwner || null : null,
      workspaceMode: doCreateWs ? selectedMode || 'private' : null,
      folderSet: doCreateWs ? selectedFolderSet || null : null,
      assignmentName: createAssignmentValue ? assignmentName || null : null,
    };
  }

  setSelectionProp(propToUpdate, value) {
    if (propToUpdate === 'selectedOwner') {
      if (this.isSameRecord(this.selectedOwner, value)) {
        return;
      }
      this.selectedOwner = value;
      return;
    }

    if (propToUpdate === 'selectedFolderSet') {
      if (this.isSameRecord(this.selectedFolderSet, value)) {
        return;
      }
      this.selectedFolderSet = value;
    }
  }

  @action
  updateDoCreateWs(val) {
    this.doCreateWs = this.normalizeBooleanValue(val);
  }

  @action
  updateSelectedMode(val) {
    this.selectedMode = val || 'private';
  }

  @action
  updateCreateAssignmentValue(val) {
    this.createAssignmentValue = this.normalizeBooleanValue(val);
  }

  @action
  updateSelectizeSingle(val, item, propToUpdate, model) {
    const isRemoval = this.utils.isNullOrUndefined(item);
    if (isRemoval) {
      this.setSelectionProp(propToUpdate, null);
      return;
    }

    if (!model || !val) {
      return;
    }

    const record = this.store.peekRecord(model, val);
    if (!record) {
      return;
    }

    this.setSelectionProp(propToUpdate, record);
  }

  @action
  resetMissingNameError() {
    this.missingNameError = null;
  }

  @action
  resetMissingOwnerError() {
    this.missingOwnerError = null;
  }

  @action
  resetMissingAssignmentError() {
    this.missingAssignmentError = null;
  }

  @action
  createWorkspace() {
    const workspaceName = this.normalizeTextValue(this.workspaceName);
    this.workspaceName = workspaceName;
    this.createWorkspaceError = null;

    if (this.selectedOwner) {
      this.missingOwnerError = null;
    }
    if (workspaceName) {
      this.missingNameError = null;
    }

    if (!workspaceName || !this.selectedOwner) {
      if (!workspaceName) {
        this.missingNameError = 'Please provide a name for your workspace';
      }
      if (!this.selectedOwner) {
        this.missingOwnerError = 'Please provide an owner for your workspace';
      }

      this.alert.showToast(
        'error',
        'Workspace name and owner are required to continue',
        'bottom-end',
        3000,
        false,
        null
      );
      return;
    }

    if (typeof this.args.onProceed === 'function') {
      this.args.onProceed(this.buildReviewPayload({ doCreateWs: true }));
    }
  }

  @action
  next() {
    let hasAssignmentError = false;

    if (this.createAssignmentValue) {
      let assignmentName = this.normalizeTextValue(this.assignmentName);
      this.assignmentName = assignmentName;

      if (!assignmentName) {
        this.missingAssignmentError =
          'Please provide a name for your assignment';
        hasAssignmentError = true;
      } else {
        this.missingAssignmentError = null;
      }
    } else {
      this.assignmentName = null;
      this.missingAssignmentError = null;
    }

    if (hasAssignmentError) {
      this.alert.showToast(
        'error',
        'Assignment name is required to continue',
        'bottom-end',
        3000,
        false,
        null
      );
      return;
    }

    if (this.doCreateWs) {
      this.createWorkspace();
      return;
    }

    this.missingNameError = null;
    this.missingOwnerError = null;
    this.createWorkspaceError = null;
    if (typeof this.args.onProceed === 'function') {
      this.args.onProceed(this.buildReviewPayload({ doCreateWs: false }));
    }
  }

  @action
  back() {
    if (typeof this.args.onBack === 'function') {
      this.args.onBack(-1);
    }
  }
}
