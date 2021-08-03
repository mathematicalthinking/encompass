import Component from '@ember/component';
import EmberMap from '@ember/map';
import { computed, observer } from '@ember/object';
import { equal } from '@ember/object/computed';
/*global _:false */
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(CurrentUserMixin, ErrorHandlingMixin, {
  tagName: '',
  elementId: 'workspace-new-copy',
  newWsConfig: null,
  workspaceToCopy: null,
  isUsingCustomConfig: false,
  customConfig: null,
  newWsName: null,
  newWsMode: null,
  newWsOwner: null,
  newWsPermissions: null,
  newFolderSetOptions: null,
  utils: service('utility-methods'),
  currentStep: () => ({
    value: 1,
    display: 'Choose Workspace to Copy',
  }),

  copyConfig: () => ({
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
  }),

  submissionsPool: computed(
    'customConfig.submissionOptions.{all,submissionIds}',
    'newWsConfig',
    'workspaceToCopy.submissions.content',
    function () {
      let allSubmissions = this.workspaceToCopy.submissions.content;
      if (!allSubmissions) {
        return [];
      }
      const newWsConfig = this.newWsConfig;
      if (
        newWsConfig !== 'D' ||
        this.customConfig.submissionOptions.all === true
      ) {
        return allSubmissions;
      }

      let customIds = this.customConfig.submissionOptions.submissionIds;
      if (this.utils.isNonEmptyArray(customIds)) {
        return allSubmissions.filter((sub) => {
          return customIds.includes(sub.get('id'));
        });
      }
      return [];
    }
  ),

  submissionsLength: computed('submissionsPool.length', function () {
    return this.submissionsPool.length || 0;
  }),
  collaboratorsCount: computed('newWsPermissions.length', function () {
    return this.newWsPermissions.length || 0;
  }),

  getCounts(model) {
    let models = ['selections', 'comments', 'responses', 'folders'];
    if (!models.includes(model)) {
      return;
    }

    const config = this.newWsConfig;
    let allRecordProp = `workspaceToCopy.${model}Length`;
    const allOriginalRecords = this.get(allRecordProp);
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
      let singular = model.slice(0, model.length - 1);

      let isAll = this.get(`customConfig.${singular}Options.all`) === true;
      let isNone = this.get(`customConfig.${singular}Options.none`) === true;

      if (model === 'folders') {
        if (isAll) {
          return allOriginalRecords;
        }
        return 0;
      }

      if (isNone) {
        return 0;
      }

      let lengths = submissions.mapBy(`${model}.length`);

      if (isAll) {
        return lengths.reduce((memo, val) => {
          return memo + val;
        }, 0);
      }

      let customCount = this.get(
        `customConfig.${singular}Options.${singular}Ids.length`
      );

      return customCount || 0;
    }
  },

  recordCounts: computed(
    'collaboratorsCount',
    'customConfig',
    'newWsConfig',
    'newWsPermissions',
    'submissionsLength',
    'workspaceToCopy',
    function () {
      return {
        submissions: this.submissionsLength,
        comments: this.getCounts('comments'),
        selections: this.getCounts('selections'),
        responses: this.getCounts('responses'),
        folders: this.getCounts('folders'),
        collaborators: this.collaboratorsCount,
      };
    }
  ),

  modeInputs: computed('currentUser.{isStudent,isAdmin}', function () {
    let res = {
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
  }),

  showSelectWorkspace: equal('currentStep.value', 1),
  // showSelectWorkspace: false,
  showSelectConfig: equal('currentStep.value', 2),
  // showSelectConfig: true,
  showOwnerSettings: equal('currentStep.value', 3),
  showPermissions: equal('currentStep.value', 4),
  showReview: equal('currentStep.value', 5),

  didReceiveAttrs: function () {
    this._super();
    let hasWorkspaceToCopy = this.model.workspaceToCopy;
    if (hasWorkspaceToCopy) {
      return this.store
        .findRecord('workspace', hasWorkspaceToCopy)
        .then((workspace) => {
          this.set('workspaceToCopy', workspace);
          this.set('selectedWorkspace', workspace);
          this.set('fromWorkspaceList', true);
        });
    }
  },

  maxSteps: computed('steps.length', function () {
    return this.steps.length - 1;
  }),

  isCopyingFolders: computed(
    'customConfig.folderOptions.@eac.{all,includeStructureOnly,none}',
    'customConfig.folderOptions.none',
    'newWsConfig',
    'workspaceToCopy.foldersLength',
    function () {
      const newWsConfig = this.newWsConfig;
      const utils = this.utils;
      const isCustomWithNoFolders = this.customConfig.folderOptions.none;

      // user has not picked a config yet
      if (utils.isNullOrUndefined(newWsConfig)) {
        return null;
      }

      // Submissions Only
      if (newWsConfig === 'A') {
        return false;
      }

      // custom config selected
      if (newWsConfig === 'D') {
        // none option selected
        if (isCustomWithNoFolders) {
          return false;
        }
      }
      // make sure chosen workspace has any folders to copy

      const foldersLength = this.workspaceToCopy.foldersLength;
      return foldersLength > 0;
    }
  ),

  submissionThreads: computed('submissions.[]', function () {
    if (!this.submissions) {
      return [];
    }
    const threads = EmberMap.create();

    this.submissions
      .sortBy('student')
      .getEach('student')
      .uniq()
      .forEach((student) => {
        if (!threads.has(student)) {
          const submissions = this.studentWork(student);
          threads.set(student, submissions);
        }
      });
    return threads;
  }),

  studentWork: function (student) {
    return this.submissions.filterBy('student', student).sortBy('createDate');
  },

  collabList: computed('newWsPermissions.[]', 'store', function () {
    //need to get the permissions object
    //get username from each permissions object and list them in the sumamry
    const formattedPermissionObjects = this.formatPermissionsObjects(
      this.newWsPermissions
    );
    if (formattedPermissionObjects) {
      let users = formattedPermissionObjects.map((object) => {
        let userId = object.user;
        let record = this.store.peekRecord('user', userId);
        if (record) {
          return record.get('username');
        }
      });
      // remove null or undefined
      return users.compact();
    }
    return;
  }),

  detailsItems: computed(
    'collabList',
    'existingFolderSet',
    'modeDisplay',
    'newFolderSetOptions.name',
    'newWsConfig',
    'newWsMode',
    'newWsName',
    'newWsOwner.{name,username}',
    'selectedConfigDisplay',
    'selectedFolderSet',
    'workspaceToCopy.name',
    function () {
      return [
        {
          label: 'Selected Workspace',
          displayValue: this.workspaceToCopy.name,
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
              displayValue: this.newWsOwner.username || this.newWsOwner.name,
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
            // {
            //   label: 'New Folder Set',
            //   displayValue: this.newFolderSetOptions.name,
            //   emptyValue: 'N/A',
            //   propName: 'newFolderSetOptions.name',
            //   associatedStep: 3,
            // },
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
  ),

  existingFolderSet: computed(
    'newFolderSetOptions.existingFolderSetToUse',
    'store',
    function () {
      let id = this.newFolderSetOptions.existingFolderSetToUse;
      if (!_.isString(id)) {
        return null;
      }
      let record = this.store.peekRecord('folder-set', id);
      return record || null;
    }
  ),

  selectedFolderSet: computed(
    'existingFolderSet',
    'newFolderSetOptions.{existingFolderSetToUse,name}',
    function () {
      let existingFolderSet = this.existingFolderSet;
      let newFolderSet = this.newFolderSetOptions.name;
      if (existingFolderSet) {
        return existingFolderSet.get('name');
      } else if (newFolderSet) {
        return newFolderSet;
      } else {
        return null;
      }
    }
  ),

  selectedConfigDisplay: computed('newWsConfig', function () {
    if (_.isNull(this.newWsConfig)) {
      return;
    }
    const hash = {
      A: 'Submissions Only',
      B: 'Submissions and Folder Structure',
      C: 'Everything',
      D: 'Custom',
    };
    return hash[this.newWsConfig];
  }),

  steps: () => [
    { value: 0 },
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
  ],

  modeDisplay: computed('newWsMode', function () {
    const hash = {
      private: 'Private',
      org: 'My Org',
      public: 'Public',
      internet: 'World Wide Web',
    };
    return hash[this.newWsMode] || null;
  }),

  formatPermissionsObjects() {
    const objects = this.newWsPermissions;

    if (this.utils.isNonEmptyArray(objects)) {
      return objects.map((obj) => {
        let user = obj.user;
        if (user && user.id) {
          obj.user = user.id;
        }
        return obj;
      });
    }
  },
  handleSubmissionsLoadingMessage: observer('loadingSubmissions', function () {
    const that = this;
    if (!this.loadingSubmissions) {
      this.set('showLoadingSubmissions', false);
      return;
    }
    later(function () {
      if (that.isDestroyed || that.isDestroying) {
        return;
      }
      if (!that.get('loadingSubmissions')) {
        return;
      }
      that.set('showLoadingSubmissions', true);
    }, 500);
  }),
  handleInProgressRequest: observer('isRequestInProgress', function () {
    const that = this;
    if (!this.isRequestInProgress) {
      this.set('showRequestLoading', false);
      return;
    }
    later(function () {
      if (that.isDestroyed || that.isDestroying) {
        return;
      }
      if (!that.get('isRequestInProgress')) {
        return;
      }
      that.set('showRequestLoading', true);
    }, 500);
  }),

  actions: {
    goToStep(stepValue) {
      if (!stepValue) {
        return;
      }
      this.set('currentStep', this.steps[stepValue]);
    },

    // proceed() {
    //   const currentStep = this.currentStep;

    //   // do validation for particular input

    //   const value = this.currentStep.inputValue;
    //   const constraints = this.currentStep.constraints;
    //   let errors = window.validate(value, constraints);
    //   if (errors) {
    //     this.set('validationErrors', errors);
    //     return;
    //   }
    //   this.send('changeStep', 1);
    // },

    changeStep(direction) {
      let currentStep = this.currentStep.value;
      let maxStep = this.maxSteps;
      if (direction === 1) {
        if (currentStep === maxStep) {
          return;
        }
        return;
      }

      if (direction === -1) {
        if (currentStep === 1) {
          return;
        }
        this.set('currentStep', this.steps[currentStep - 1]);
      }
    },
    setOriginalWorkspace() {
      const workspace = this.selectedWorkspace;

      this.set('workspaceToCopy', workspace);
      this.set('defaultName', `Copy of ${workspace.get('name')}`);

      // need to reset config, settings, and collaborators to default if already selected
      let propsToReset = [
        'newWsConfig',
        'newWsMode',
        'newWsOwner',
        'customConfig',
        'newWsPermissions',
        'newWsName',
        'newFolderSetOptions',
      ];
      _.each(propsToReset, (prop) => {
        if (prop) {
          this.set(prop, null);
        }
        if (this.isUsingCustomConfig) {
          this.set('isUsingCustomConfig', false);
        }
      });
      // start process of loading submissions - may need these for config step
      // for large workspaces(i.e. 1000+ submissions - this could take a long time)
      this.set('loadingSubmissions', true);
      this.workspaceToCopy.submissions
        .then((submissions) => {
          this.set('submissions', submissions);
          this.set('loadingSubmissions', false);
          this.set('currentStep', this.steps[2]);
        })
        .catch((err) => {
          this.set('loadingSubmissions', false);
          this.handleErrors(err, 'loadSubmissionsError');
        });
    },

    setConfig(config, customConfig) {
      this.set('newWsConfig', config);
      if (customConfig) {
        this.set('customConfig', customConfig);
      }
      this.set('currentStep', this.steps[3]);
    },
    setOwnerSettings(name, owner, mode, folderSetOptions) {
      this.set('newWsName', name);
      this.set('newWsOwner', owner);
      this.set('newWsMode', mode);
      this.set('newFolderSetOptions', folderSetOptions);
      this.set('currentStep', this.steps[4]);
    },
    setPermissions(permissions) {
      this.set('newWsPermissions', permissions);
      // console.log('')
      this.set('currentStep', this.steps[5]);
    },
    createCopyRequest() {
      const selectedConfig = this.newWsConfig;
      const owner = this.newWsOwner;
      const name = this.newWsName;
      const originalWsId = this.workspaceToCopy;
      const mode = this.newWsMode;

      const formattedPermissionObjects = this.formatPermissionsObjects(
        this.newWsPermissions
      );

      let copyRequest;
      let requestSource;

      let base = {
        owner,
        name,
        originalWsId,
        mode,
        createDate: Date.now(),
        lastModifiedDate: Date.now(),
        createdBy: this.currentUser,
      };

      let folderSetOptions = this.newFolderSetOptions;
      if (folderSetOptions) {
        if (!folderSetOptions.doCreateFolderSet) {
          delete folderSetOptions.name;
          delete folderSetOptions.privacySetting;
          if (!folderSetOptions.existingFolderSetToUse) {
            delete folderSetOptions.existingFolderSetToUse;
          }
        }
      }

      let baseOptions = {
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
      // basic shallow with folders

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
          // customConfig does not have the permissionOptions
          requestSource.permissionOptions = {
            permissionObjects: formattedPermissionObjects,
          };
        } else {
          this.set('customConfigError', true);
          return;
        }
      }
      copyRequest = this.store.createRecord(
        'copyWorkspaceRequest',
        requestSource
      );
      this.set('isRequestInProgress', true);
      copyRequest
        .save()
        .then((result) => {
          this.set('isRequestInProgress', false);
          const error = result.get('copyWorkspaceError');
          if (error) {
            this.set('copyWorkspaceError', error);
            return;
          }
          const createdWorkspace = result.get('createdWorkspace');

          if (createdWorkspace) {
            this.sendAction('toWorkspace', createdWorkspace);
          } else {
            // something went wrong?
            this.set(
              'copyWorkspaceError',
              'Sorry, there was an unknown error.'
            );
          }
        })
        .catch((err) => {
          this.set('isRequestInProgress', false);
          this.handleErrors(err, 'serverErrors');
        });
    },
    toggleMenu: function () {
      $('#filter-list-side').toggleClass('collapse');
      $('#arrow-icon').toggleClass('fa-rotate-180');
      $('#filter-list-side').addClass('animated slideInLeft');
    },
  },
});
