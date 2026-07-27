import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { later } from '@ember/runloop';
import { registerDestructor } from '@ember/destroyable';

export default class WorkspaceNewCopyComponent extends Component {
  @service('error-handling') errorHandling;
  @service store;
  @service router;
  @service('utility-methods') utils;
  @service currentUser;

  @tracked newWsConfig = null;
  @tracked workspaceToCopy = null;
  @tracked isUsingCustomConfig = false;
  @tracked customConfig = null;
  @tracked newWsName = null;
  @tracked newWsMode = null;
  @tracked newWsOwner = null;
  @tracked newWsPermissions = null;
  @tracked newFolderSetOptions = null;
  @tracked currentStep = { value: 1, display: 'Choose Workspace to Copy' };

  @tracked selectedWorkspace = null;
  @tracked fromWorkspaceList = false;
  @tracked defaultName = null;
  @tracked submissions = null;
  @tracked loadingSubmissions = false;
  @tracked showLoadingSubmissions = false;
  @tracked isRequestInProgress = false;
  @tracked showRequestLoading = false;
  @tracked customConfigError = false;
  @tracked copyWorkspaceError = null;

  // replaces the jQuery filter-sidebar collapse toggle
  @tracked isFilterCollapsed = true;

  _isDestroyed = false;

  copyConfig = {
    groupName: 'copyConfig',
    required: true,
    inputs: [
      {
        value: 'A',
        label: 'Submissions Only',
        moreInfo: 'Copy only the submissions used in this workspace',
      },
      {
        value: 'B',
        label: 'Submissions and Folder Structure',
        moreInfo:
          'Copy the submissions and the folder structure (not content) used in this workspace',
      },
      {
        value: 'C',
        label: 'Everything',
        moreInfo:
          'Copy everything used in this workspace (submissions, selections, folders, taggings, comments, responses)',
      },
      {
        value: 'D',
        label: 'Custom',
        moreInfo:
          'Decide which to copy for submissions, selections, folders, taggings, comments and responses',
      },
    ],
  };

  steps = [
    { value: 0 },
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
  ];

  constructor() {
    super(...arguments);
    registerDestructor(this, () => (this._isDestroyed = true));

    // seed a pre-selected workspace when arriving from the workspace list
    const wsToCopyId = this.args.model?.workspaceToCopy;
    if (wsToCopyId) {
      this.store.findRecord('workspace', wsToCopyId).then((workspace) => {
        if (this._isDestroyed) {
          return;
        }
        this.workspaceToCopy = workspace;
        this.selectedWorkspace = workspace;
        this.fromWorkspaceList = true;
      });
    }
  }

  // errors are stored on the error-handling service, keyed by name
  get serverErrors() {
    return this.errorHandling.getErrors('serverErrors');
  }
  get loadSubmissionErrors() {
    return this.errorHandling.getErrors('loadSubmissionsError');
  }

  get showSelectWorkspace() {
    return this.currentStep.value === 1;
  }
  get showSelectConfig() {
    return this.currentStep.value === 2;
  }
  get showOwnerSettings() {
    return this.currentStep.value === 3;
  }
  get showPermissions() {
    return this.currentStep.value === 4;
  }
  get showReview() {
    return this.currentStep.value === 5;
  }

  get maxSteps() {
    return this.steps.length - 1;
  }

  get submissionsPool() {
    const allSubmissions = this.submissions;
    if (!allSubmissions) {
      return [];
    }
    const newWsConfig = this.newWsConfig;
    if (
      newWsConfig !== 'D' ||
      this.customConfig?.submissionOptions?.all === true
    ) {
      return allSubmissions;
    }
    const customIds = this.customConfig?.submissionOptions?.submissionIds;
    if (this.utils.isNonEmptyArray(customIds)) {
      return allSubmissions.filter((sub) => customIds.includes(sub.get('id')));
    }
    return [];
  }

  get submissionsLength() {
    return this.submissionsPool?.length || 0;
  }

  get collaboratorsCount() {
    return this.newWsPermissions?.length || 0;
  }

  getCounts(model) {
    const models = ['selections', 'comments', 'responses', 'folders'];
    if (!models.includes(model)) {
      return;
    }

    const config = this.newWsConfig;
    const allOriginalRecords = this.workspaceToCopy?.get(`${model}Length`);
    if (!config) {
      return allOriginalRecords;
    }
    if (config === 'A') {
      return 0;
    }
    if (config === 'B' || config === 'C') {
      return allOriginalRecords;
    }

    const submissions = this.submissionsPool;
    if (!submissions) {
      return 0;
    }
    if (config === 'D') {
      const singular = model.slice(0, model.length - 1);
      const options = this.customConfig?.[`${singular}Options`];
      const isAll = options?.all === true;
      const isNone = options?.none === true;

      if (model === 'folders') {
        return isAll ? allOriginalRecords : 0;
      }
      if (isNone) {
        return 0;
      }

      const lengths = submissions.mapBy(`${model}.length`);
      if (isAll) {
        return lengths.reduce((memo, val) => memo + val, 0);
      }
      return options?.[`${singular}Ids`]?.length || 0;
    }
    return undefined;
  }

  get recordCounts() {
    return {
      submissions: this.submissionsLength,
      comments: this.getCounts('comments'),
      selections: this.getCounts('selections'),
      responses: this.getCounts('responses'),
      folders: this.getCounts('folders'),
      collaborators: this.collaboratorsCount,
    };
  }

  get modeInputs() {
    const res = {
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

    if (this.currentUser.isStudent || !this.currentUser.isAdmin) {
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

  get isCopyingFolders() {
    const newWsConfig = this.newWsConfig;
    const utils = this.utils;
    const isCustomWithNoFolders = this.customConfig?.folderOptions?.none;

    // user has not picked a config yet
    if (utils.isNullOrUndefined(newWsConfig)) {
      return null;
    }
    // Submissions Only
    if (newWsConfig === 'A') {
      return false;
    }
    // custom config with the "none" folder option
    if (newWsConfig === 'D' && isCustomWithNoFolders) {
      return false;
    }
    // make sure the chosen workspace has any folders to copy
    const foldersLength = this.workspaceToCopy?.get('foldersLength');
    return foldersLength > 0;
  }

  get submissionThreads() {
    // a Map keyed by student, consumed by ws-copy-custom-config's "By Student"
    // option via forEach((submissions, student)) and get(student)
    const threads = new Map();
    if (!this.submissions) {
      return threads;
    }
    this.submissions
      .sortBy('student')
      .getEach('student')
      .uniq()
      .forEach((student) => {
        if (!threads.has(student)) {
          threads.set(student, this.studentWork(student));
        }
      });
    return threads;
  }

  studentWork(student) {
    return this.submissions.filterBy('student', student).sortBy('createDate');
  }

  formatPermissionsObjects() {
    const objects = this.newWsPermissions;
    if (this.utils.isNonEmptyArray(objects)) {
      return objects.map((obj) => {
        const user = obj.user;
        if (user && user.id) {
          obj.user = user.id;
        }
        return obj;
      });
    }
    return undefined;
  }

  get collabList() {
    const formattedPermissionObjects = this.formatPermissionsObjects();
    if (formattedPermissionObjects) {
      return formattedPermissionObjects
        .map((object) => {
          const record = this.store.peekRecord('user', object.user);
          return record ? record.get('username') : null;
        })
        .filter(Boolean);
    }
    return undefined;
  }

  get existingFolderSet() {
    const id = this.newFolderSetOptions?.existingFolderSetToUse;
    if (typeof id !== 'string') {
      return null;
    }
    return this.store.peekRecord('folder-set', id) || null;
  }

  get selectedFolderSet() {
    const existingFolderSet = this.existingFolderSet;
    const newFolderSet = this.newFolderSetOptions?.name;
    if (existingFolderSet) {
      return existingFolderSet.get('name');
    } else if (newFolderSet) {
      return newFolderSet;
    }
    return null;
  }

  get selectedConfigDisplay() {
    if (this.newWsConfig === null) {
      return undefined;
    }
    const hash = {
      A: 'Submissions Only',
      B: 'Submissions and Folder Structure',
      C: 'Everything',
      D: 'Custom',
    };
    return hash[this.newWsConfig];
  }

  get modeDisplay() {
    const hash = {
      private: 'Private',
      org: 'My Org',
      public: 'Public',
      internet: 'World Wide Web',
    };
    return hash[this.newWsMode] || null;
  }

  get detailsItems() {
    return [
      {
        label: 'Selected Workspace',
        displayValue: this.workspaceToCopy?.get('name'),
        emptyValue: 'No workspace',
        propName: 'workspaceToCopy',
        associatedStep: 1,
      },
      {
        label: 'Selected Configuration',
        displayValue: this.selectedConfigDisplay,
        emptyValue: 'No Configuration',
        propName: 'newWsConfig',
        associatedStep: 2,
      },
      {
        label: 'New Workspace Info',
        propName: 'wsInfo',
        associatedStep: 3,
        children: [
          {
            label: 'Name',
            displayValue: this.newWsName,
            emptyValue: 'No Name',
            propName: 'newWsName',
            associatedStep: 3,
          },
          {
            label: 'Owner',
            displayValue:
              this.newWsOwner?.get('username') || this.newWsOwner?.get('name'),
            emptyValue: 'No Owner',
            propName: 'owner',
            associatedStep: 3,
          },
          {
            label: 'Privacy Setting',
            displayValue: this.modeDisplay,
            emptyValue: 'No Privacy Setting',
            propName: 'newWsMode',
            associatedStep: 3,
          },
          {
            label: 'Folder Set',
            displayValue: this.selectedFolderSet,
            emptyValue: 'N/A',
            propName: 'existingFolderSet',
            associatedStep: 3,
          },
        ],
      },
      {
        label: 'Collaborators',
        displayValue: this.collabList,
        isArray: true,
        emptyValue: 'No Collaborators',
        propName: 'collabs',
        associatedStep: 4,
      },
    ];
  }

  // show the loading spinner only if loading takes longer than 500ms
  scheduleLoadingSubmissionsMessage() {
    later(() => {
      if (this._isDestroyed || !this.loadingSubmissions) {
        return;
      }
      this.showLoadingSubmissions = true;
    }, 500);
  }

  scheduleRequestLoadingMessage() {
    later(() => {
      if (this._isDestroyed || !this.isRequestInProgress) {
        return;
      }
      this.showRequestLoading = true;
    }, 500);
  }

  @action
  goToStep(stepValue) {
    if (!stepValue) {
      return;
    }
    this.currentStep = this.steps[stepValue];
  }

  @action
  changeStep(direction) {
    const currentStep = this.currentStep.value;
    if (direction === 1) {
      return;
    }
    if (direction === -1) {
      if (currentStep === 1) {
        return;
      }
      this.currentStep = this.steps[currentStep - 1];
    }
  }

  @action
  setSelectedWorkspace(workspace) {
    this.selectedWorkspace = workspace;
  }

  @action
  setOriginalWorkspace() {
    const workspace = this.selectedWorkspace;
    this.workspaceToCopy = workspace;
    this.defaultName = `Copy of ${workspace.get('name')}`;

    // reset config/settings/collaborators to default if already selected
    this.newWsConfig = null;
    this.newWsMode = null;
    this.newWsOwner = null;
    this.customConfig = null;
    this.newWsPermissions = null;
    this.newWsName = null;
    this.newFolderSetOptions = null;
    this.isUsingCustomConfig = false;

    // load submissions - may need them for the config step. Large workspaces
    // (1000+ submissions) can take a while.
    this.loadingSubmissions = true;
    this.scheduleLoadingSubmissionsMessage();
    this.workspaceToCopy
      .get('submissions')
      .then((submissions) => {
        this.submissions = submissions;
        this.loadingSubmissions = false;
        this.showLoadingSubmissions = false;
        this.currentStep = this.steps[2];
      })
      .catch((err) => {
        this.loadingSubmissions = false;
        this.showLoadingSubmissions = false;
        this.errorHandling.handleErrors(err, 'loadSubmissionsError');
      });
  }

  @action
  setConfig(config, customConfig) {
    this.newWsConfig = config;
    if (customConfig) {
      this.customConfig = customConfig;
    }
    this.currentStep = this.steps[3];
  }

  @action
  setOwnerSettings(name, owner, mode, folderSetOptions) {
    this.newWsName = name;
    this.newWsOwner = owner;
    this.newWsMode = mode;
    this.newFolderSetOptions = folderSetOptions;
    this.currentStep = this.steps[4];
  }

  @action
  setPermissions(permissions) {
    this.newWsPermissions = permissions;
    this.currentStep = this.steps[5];
  }

  @action
  createCopyRequest() {
    const selectedConfig = this.newWsConfig;
    const owner = this.newWsOwner;
    const name = this.newWsName;
    const originalWsId = this.workspaceToCopy;
    const mode = this.newWsMode;

    const formattedPermissionObjects = this.formatPermissionsObjects();

    let requestSource;

    const base = {
      owner,
      name,
      originalWsId,
      mode,
      createDate: Date.now(),
      lastModifiedDate: Date.now(),
      createdBy: this.currentUser.user,
    };

    const folderSetOptions = this.newFolderSetOptions;
    if (folderSetOptions && !folderSetOptions.doCreateFolderSet) {
      delete folderSetOptions.name;
      delete folderSetOptions.privacySetting;
      if (!folderSetOptions.existingFolderSetToUse) {
        delete folderSetOptions.existingFolderSetToUse;
      }
    }

    const baseOptions = {
      submissionOptions: { all: true },
      folderOptions: {
        folderSetOptions: this.newFolderSetOptions,
        none: true,
      },
      selectionOptions: { none: true },
      commentOptions: { none: true },
      responseOptions: { none: true },
      permissionOptions: {
        permissionObjects: formattedPermissionObjects,
      },
    };

    if (selectedConfig === 'A') {
      requestSource = Object.assign(base, baseOptions);
    } else if (selectedConfig === 'B') {
      delete baseOptions.folderOptions.none;
      baseOptions.folderOptions.all = true;
      baseOptions.folderOptions.includeStructureOnly = true;
      requestSource = Object.assign(base, baseOptions);
    } else if (selectedConfig === 'C') {
      baseOptions.folderOptions.includeStructureOnly = false;
      delete baseOptions.folderOptions.none;
      baseOptions.folderOptions.all = true;

      baseOptions.selectionOptions.all = true;
      delete baseOptions.selectionOptions.none;

      baseOptions.commentOptions.all = true;
      delete baseOptions.commentOptions.none;

      baseOptions.responseOptions.all = true;
      delete baseOptions.responseOptions.none;
      requestSource = Object.assign(base, baseOptions);
    } else if (selectedConfig === 'D') {
      const customConfig = this.customConfig;
      if (this.utils.isNonEmptyObject(customConfig)) {
        customConfig.folderOptions.folderSetOptions = folderSetOptions;
        requestSource = Object.assign(base, customConfig);
        // customConfig does not carry the permissionOptions
        requestSource.permissionOptions = {
          permissionObjects: formattedPermissionObjects,
        };
      } else {
        this.customConfigError = true;
        return;
      }
    }

    const copyRequest = this.store.createRecord(
      'copyWorkspaceRequest',
      requestSource
    );
    this.isRequestInProgress = true;
    this.scheduleRequestLoadingMessage();
    copyRequest
      .save()
      .then((result) => {
        this.isRequestInProgress = false;
        this.showRequestLoading = false;
        const error = result.get('copyWorkspaceError');
        if (error) {
          this.copyWorkspaceError = error;
          return;
        }
        const createdWorkspaceId = result.belongsTo('createdWorkspace').id();
        if (createdWorkspaceId) {
          this.router.transitionTo('workspace.work', createdWorkspaceId);
        } else {
          this.copyWorkspaceError = 'Sorry, there was an unknown error.';
        }
      })
      .catch((err) => {
        this.isRequestInProgress = false;
        this.showRequestLoading = false;
        this.errorHandling.handleErrors(err, 'serverErrors');
      });
  }

  @action
  resetCustomConfigError() {
    this.customConfigError = false;
  }

  @action
  resetCopyWorkspaceError() {
    this.copyWorkspaceError = null;
  }

  @action
  toggleMenu() {
    this.isFilterCollapsed = !this.isFilterCollapsed;
  }

  @action
  collapseFilter() {
    this.isFilterCollapsed = true;
  }
}
