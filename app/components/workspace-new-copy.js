/*global _:false */
Encompass.WorkspaceNewCopyComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
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
  utils: Ember.inject.service('utility-methods'),
  currentStep: {
    value: 1,
    display: 'Choose Workspace to Copy',
  },

  copyConfig:
    {
      groupName: 'copyConfig',
      required: true,
      inputs: [
        {
          value: 'A',
          label: 'Submissions Only',
          moreInfo: 'Copy only the submissions used in this workspace'
        },
        {
          value: 'B',
          label: 'Submissions and Folder Structure',
          moreInfo: 'Copy the submissions and the folder structure (not content) used in this workspace'
        },
        {
          value: 'C',
          label: 'Everything',
          moreInfo: 'Copy everything used in this workspace (submissions, selections, folders, taggings, comments, responses)'
        },
        {
          value: 'D',
          label: 'Custom',
          moreInfo: 'Decide which to copy for submissions, selections, folders, taggings, comments and responses'
        }
      ]
    },

  modeInputs: function() {
    let res = {
      groupName: 'mode',
      required: true,
      inputs: [
        {
          value: 'private',
          label: 'Private',
          moreInfo: 'Workspace will only be visible to the owner and collaborators',
        },
        {
          value: 'org',
          label: 'My Org',
          moreInfo: 'Workspace will be visible to everyone belonging to your org',
        },
        {
          value: 'public',
          label: 'Public',
          moreInfo: 'Workspace will be visible to every Encompass user',
        },
      ]
    };

    if (this.get('currentUser.isStudent') || !this.get('currentUser.isAdmin') ) {
      return res;
    }

    res.inputs.push({
      value: 'internet',
      label: 'Internet',
      moreInfo: 'Workspace will be accesible to any user with a link to the workspace',
    });
    return res;
  }.property('currentUser.isStudent', 'currentUser.isAdmin'),

  activeStep: function() {
    console.log('activeStep function running');
    if (this.get('currentStep.value') >= 1) {
      console.log('yes');
    }
  }.property('currentStep.value'),

  //add class active-step if step-# is less than or equal to currentStep.value

  showSelectWorkspace: Ember.computed.equal('currentStep.value', 1),
  // showSelectWorkspace: false,
  showSelectConfig: Ember.computed.equal('currentStep.value', 2),
  // showSelectConfig: true,
  showOwnerSettings: Ember.computed.equal('currentStep.value', 3),
  showPermissions: Ember.computed.equal('currentStep.value', 4),
  showReview: Ember.computed.equal('currentStep.value', 5),

  didReceiveAttrs: function() {
    let hasWorkspaceToCopy = this.get('model.workspaceToCopy');
    if (hasWorkspaceToCopy) {
      return this.store.findRecord('workspace', hasWorkspaceToCopy)
      .then((workspace) => {
        this.set('workspaceToCopy', workspace);
        this.set('selectedWorkspace', workspace);
        this.set('fromWorkspaceList', true);
      });
    }
  },

  maxSteps: function() {
    return this.get('steps.length') - 1;
  }.property('steps'),

  isCopyingFolders: function() {
    const newWsConfig = this.get('newWsConfig');
    const utils = this.get('utils');
    const isCustomWithNoFolders = this.get('customConfig.folderOptions.none');

    // user has not picked a config yet
    if (utils.isNullOrUndefined(newWsConfig)) {
      return null;
    }

    // Shallow with no folders
    if (newWsConfig === 'B') {
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

    const foldersLength = this.get('workspaceToCopy.foldersLength');
    return foldersLength > 0;
  }.property('newWsConfig', 'workspaceToCopy.foldersLength', 'customConfig.folderOptions.@each{all,includeStructureOnly,none}'),

  submissionThreads: function() {
    if (!this.get('submissions')) {
      return [];
    }
    const threads = Ember.Map.create();

    this.get('submissions')
      .sortBy('student')
      .getEach('student')
      .uniq()
      .forEach((student) => {
        if(!threads.has(student)) {
          const submissions = this.studentWork(student);
          threads.set(student, submissions);
        }
      });
    return threads;
  }.property('submissions.[]'),

  studentWork: function(student) {
    return this.get('submissions')
      .filterBy('student', student)
      .sortBy('createDate');

  },

  detailsItems: function() {
    return [
      {
        label: 'Selected Workspace',
        displayValue: this.get('workspaceToCopy.name'),
        emptyValue: 'No workspace',
        propName: 'workspaceToCopy',
        associatedStep: 1
      },
      {
        label: 'Selected Configuration',
        displayValue: this.get('selectedConfigDisplay'),
        emptyValue: 'No Configuration',
        propName: 'newWsConfig',
        associatedStep: 2
      },
      {
        label: 'New Workspace Info',
        propName: 'wsInfo',
        associatedStep: 3,
        children: [
          {
            label: 'Name',
            displayValue: this.get('newWsName'),
            emptyValue: 'No Name',
            propName: 'newWsName',
            associatedStep: 3,
          },
          {
            label: 'Owner',
            displayValue: this.get('newWsOwner.username') || this.get('newWsOwner.name'),
            emptyValue: 'No Owner',
            propName: 'owner',
            associatedStep: 3
          },
          {
            label: 'Privacy Setting',
            displayValue: this.get('modeDisplay'),
            emptyValue: 'No Privacy Setting',
            propName: 'newWsMode',
            associatedStep: 3,
          },
        ],
      },
      {
        label: 'Collaborators',
        displayValue: this.get('newWsPermissions'),
        emptyValue: 'No Collaborators',
        propName: 'collabs',
        associatedStep: 4,
      },
    ];
  }.property('workspaceToCopy', 'newWsConfig', 'newWsName', 'newWsOwner', 'newWsMode'),

  selectedConfigDisplay: function() {
    if (_.isNull(this.get('newWsConfig'))) {
      return;
    }
    const hash = {
      A: 'Submissions Only',
      B: 'Submissions and Folder Structure',
      C: 'Everything',
      D: 'Custom'
    };
    return hash[this.get('newWsConfig')];
  }.property('newWsConfig'),

  steps: [
    {value: 0, display: ''},
    {
      value: 1,
      display: 'Choose Workspace to Copy',
    },
     {
      value: 2,
      display: 'Choose Preset or Custom Configuration',
    },
   {
      value: 3,
      display: 'Choose Owner Settings',
    },
   {
      value: 4,
      display: 'Customize Permissions',
    },
    {value: 5, display: 'Review', }
  ],

  // currentStepDisplay: function() {
  //   let currentStep = this.get('currentStep');


  //   // const hash = {
  //   //   1: 'Choose Workspace to Copy',
  //   //   2: 'Choose Preset or Custom Configuration',
  //   //   3: 'Give New Workspace a Name',
  //   //   4: 'Choose Owner',
  //   //   5: 'Choose Privacy Setting'

  //   // };
  //   return this.get('stepHash')[currentStep];

  // }.property('currentStep'),

  modeDisplay: function() {
    const hash = {
      private: 'Private' ,
      org: 'My Org',
      public: 'Public' ,
      internet: 'World Wide Web',
    };
    return hash[this.get('newWsMode')] || null;

  }.property('newWsMode'),

  formatPermissionsObjects() {
    const objects = this.get('newWsPermissions');

    if (this.get('utils').isNonEmptyArray(objects)) {
      return objects.map((obj) => {
        let user = obj.user;
        if (user && user.id) {
          obj.user = user.id;
        }
        return obj;
      });
    }
  },
  handleSubmissionsLoadingMessage: function() {
    const that = this;
    if (!this.get('loadingSubmissions')) {
      this.set('showLoadingSubmissions', false);
      return;
    }
    Ember.run.later(function() {
      if (that.isDestroyed || that.isDestroying) {
        return;
      }
      if (!that.get('loadingSubmissions')) {
        return;
      }
      that.set('showLoadingSubmissions', true);
    }, 500);

  }.observes('loadingSubmissions'),
  handleInProgressRequest: function() {
    const that = this;
    if (!this.get('isRequestInProgress')) {
      this.set('showRequestLoading', false);
      return;
    }
    Ember.run.later(function() {
      if (that.isDestroyed || that.isDestroying) {
        return;
      }
      if (!that.get('isRequestInProgress')) {
        return;
      }
      that.set('showRequestLoading', true);
    }, 500);

  }.observes('isRequestInProgress'),

  actions: {
    goToStep(stepValue) {
      if(!stepValue) {
        return;
      }
      this.set('currentStep', this.get('steps')[stepValue]);
    },

    // proceed() {
    //   const currentStep = this.get('currentStep');

    //   // do validation for particular input

    //   const value = this.get('currentStep.inputValue');
    //   const constraints = this.get('currentStep.constraints');
    //   let errors = window.validate(value, constraints);
    //   if (errors) {
    //     this.set('validationErrors', errors);
    //     return;
    //   }
    //   this.send('changeStep', 1);
    // },

    changeStep(direction) {
      let currentStep = this.get('currentStep.value');
      let maxStep = this.get('maxSteps');
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
        this.set('currentStep', this.get('steps')[currentStep - 1]);
      }
    },
    setOriginalWorkspace() {
      const workspace = this.get('selectedWorkspace');

      this.set('workspaceToCopy', workspace);
      this.set('defaultName', `Copy of ${workspace.get('name')}`);

      // start process of loading submissions - may need these for config step
      // for large workspaces(i.e. 1000+ submissions - this could take a long time)
      this.set('loadingSubmissions', true);
      this.get('workspaceToCopy.submissions').then((submissions) => {
        this.set('submissions', submissions);
        this.set('loadingSubmissions', false);
        this.set('currentStep', this.get('steps')[2]);
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
      this.set('currentStep', this.get('steps')[3]);
    },
    setOwnerSettings(name, owner, mode, folderSetOptions) {
      this.set('newWsName', name);
      this.set('newWsOwner', owner);
      this.set('newWsMode', mode);
      this.set('newFolderSetOptions', folderSetOptions);
      this.set('currentStep', this.get('steps')[4]);

    },
    setPermissions(permissions) {
      this.set('newWsPermissions', permissions);
      // console.log('')
      this.set('currentStep', this.get('steps')[5]);
    },
    createCopyRequest() {
      const selectedConfig = this.get('newWsConfig');
      const owner = this.get('newWsOwner');
      const name = this.get('newWsName');
      const originalWsId = this.get('workspaceToCopy');
      const mode = this.get('newWsMode');

      const formattedPermissionObjects = this.formatPermissionsObjects(this.get('newWsPermissions'));

      let copyRequest;
      let requestSource;

      let base = {
        owner,
        name,
        originalWsId,
        mode,
        createDate: Date.now(),
        lastModifiedDate: Date.now(),
        createdBy: this.get('currentUser')
      };

      let folderSetOptions = this.get('newFolderSetOptions');

      if (!folderSetOptions.doCreateFolderSet) {
        delete folderSetOptions.name;
        delete folderSetOptions.privacySetting;
        if (!folderSetOptions.existingFolderSetToUse) {
          delete folderSetOptions.existingFolderSetToUse;
        }
      }

      let baseOptions = {
        submissionOptions : { all: true },
        folderOptions : {
          includeStructureOnly: true,
          folderSetOptions: this.get('newFolderSetOptions'),
          all: true
        },
        selectionOptions : { none: true },
        commentOptions : { none: true },
        responseOptions : {  none: true},
        permissionOptions: {
          permissionObjects: formattedPermissionObjects
        }
      };
        // basic shallow with folders

      if (selectedConfig === 'A') {
        requestSource = Object.assign(base, baseOptions);

      } else if (selectedConfig === 'B') {
        delete baseOptions.folderOptions.all;
        baseOptions.folderOptions.none = true;
        requestSource = Object.assign(base, baseOptions);
      } else if (selectedConfig === 'C') {
        baseOptions.folderOptions.includeStructureOnly = false;

        baseOptions.selectionOptions.all = true;
        delete baseOptions.selectionOptions.none;

        baseOptions.commentOptions.all = true;
        delete baseOptions.commentOptions.none;

        baseOptions.responseOptions.all = true;
        delete baseOptions.responseOptions.none;
        requestSource = Object.assign(base, baseOptions);
      } else if (selectedConfig === 'D') {
        const customConfig = this.get('customConfig');
        if (this.get('utils').isNonEmptyObject(customConfig)) {
          customConfig.folderOptions.folderSetOptions = folderSetOptions;
          requestSource = Object.assign(base, customConfig);
        } else {
          this.set('customConfigError', true);
          return;
        }
      }
      copyRequest = this.get('store').createRecord('copyWorkspaceRequest', requestSource);
      this.set('isRequestInProgress', true);
      copyRequest.save()
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
            this.set('copyWorkspaceError', 'Sorry, there was an unknown error.');
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
  }
});