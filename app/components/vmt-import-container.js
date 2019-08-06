Encompass.VmtImportContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'vmt-import-container',

  alert: Ember.inject.service('sweet-alert'),

  vmtUsername: null,
  vmtUserId: null,

  steps: [
    { value: 0 }, // placeholder
    { value: 1 }, // search for rooms / activities
    { value: 2 }, // Create workspace details if creating workspace
    { value: 3 }, // review
  ],

  currentStep: { value: 1 },

  showSelectRooms: Ember.computed.equal('currentStep.value', 1),
  showCreateWs: Ember.computed.equal('currentStep.value', 2),
  showReview: Ember.computed.equal('currentStep.value', 3),

  selectedRooms: null,
  mostRecentSearchResults: null,

  maxSteps: function () {
    return this.get('steps.length') - 1;
  }.property('steps'),

  detailsItems: function() {
    return [
      {
        label: 'Selected Rooms',
        displayValue: this.get('selectedRooms.length'),
        emptyValue: 'No Rooms',
        propName: 'selectedRooms.length',
        associatedStep: 1
      },
      {
        label: 'Created Workspace',
        displayValue: this.get('workspaceName'),
        emptyValue: 'No Workspace',
        propName: 'workspaceName',
        associatedStep: 2
      },
    ];
  }.property(
    'selectedRooms.[]',
    'workspaceName',
  ),

  actions: {
    goToStep(stepValue) {
      if (!stepValue) {
        return;
      }

      this.set('currentStep', this.get('steps')[stepValue]);
    },

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

    setSelectedRooms(rooms, searchResults) {
      this.set('selectedRooms', rooms);
      this.set('mostRecentSearchResults', searchResults);
      this.set('currentStep', this.get('steps')[2]);
    },

    toggleMenu: function() {
      $('#filter-list-side').toggleClass('collapse');
      $('#arrow-icon').toggleClass('fa-rotate-180');
      $('#filter-list-side').addClass('animated slideInLeft');
    },
    setPreviousSearchResults(results) {
      this.set('mostRecentSearchResults', results);
    },
    prepareReview() {
      this.set('currentStep', this.get('steps')[3]);
    },
    uploadAnswers() {
      this.set('isUploadingAnswer', true);
      let rooms = this.get('selectedRooms');

      if (!rooms) {
        return this.set('invalidRoomsError', 'At least one room must be selected');
      }
      let importRequest = this.get('store').createRecord('vmt-import-request', {
        workspaceOwner: this.get('workspaceOwner'),
        workspaceName: this.get('workspaceName'),
        workspaceMode: this.get('workspaceMode'),
        folderSet: this.get('folderSet'),
        doCreateWorkspace: this.get('doCreateWs'),
        vmtRooms: rooms,
        permissionObjects: this.get('permissionObjects') || [],
      });
      importRequest.save()
        .then((results) => {
          this.set('isUploadingAnswer', false);
          if (results.get('createdWorkspace.content')) {
            this.set('createdWorkspace', results.get('createdWorkspace'));
            this.sendAction('toWorkspaces', results.get('createdWorkspace'));

            this.get('alert').showToast('success', 'Workspace Created', 'bottom-end', 4000, false, null);
            return;
          }
          this.set('uploadedAnswers', results.get('createdAnswers'));
        })
      .catch((err) => {
        this.set('isUploadingAnswer', false);
        this.handleErrors(err, 'postErrors');
      });
    },

    importWork: function () {
      if (this.get('assignmentName')) {
        this.send('createAssignment');
      } else {
        this.send('uploadAnswers');
      }
    },

  }

});