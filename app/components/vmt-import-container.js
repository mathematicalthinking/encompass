import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(CurrentUserMixin, ErrorHandlingMixin, {
  elementId: 'vmt-import-container',

  alert: service('sweet-alert'),

  vmtUsername: null,
  vmtUserId: null,
  selectedMode: 'private',

  steps: [
    { value: 0 }, // placeholder
    { value: 1 }, // search for rooms / activities
    { value: 2 }, // Create workspace details if creating workspace
    { value: 3 }, // review
  ],

  currentStep: { value: 1 },

  showSelectRooms: equal('currentStep.value', 1),
  showCreateWs: equal('currentStep.value', 2),
  showReview: equal('currentStep.value', 3),

  selectedRooms: null,
  mostRecentSearchResults: null,

  maxSteps: computed('steps', function () {
    return this.steps.length - 1;
  }),

  detailsItems: computed('selectedRooms.[]', 'workspaceName', function () {
    return [
      {
        label: 'Selected Rooms',
        displayValue: this.selectedRooms.length,
        emptyValue: 'No Rooms',
        propName: 'selectedRooms.length',
        associatedStep: 1,
      },
      {
        label: 'Created Workspace',
        displayValue: this.workspaceName,
        emptyValue: 'No Workspace',
        propName: 'workspaceName',
        associatedStep: 2,
      },
    ];
  }),

  actions: {
    goToStep(stepValue) {
      if (!stepValue) {
        return;
      }

      this.set('currentStep', this.steps[stepValue]);
    },

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

    setSelectedRooms(rooms, searchResults) {
      this.set('selectedRooms', rooms);
      this.set('mostRecentSearchResults', searchResults);
      this.set('currentStep', this.steps[2]);
    },

    toggleMenu: function () {
      $('#filter-list-side').toggleClass('collapse');
      $('#arrow-icon').toggleClass('fa-rotate-180');
      $('#filter-list-side').addClass('animated slideInLeft');
    },
    setPreviousSearchResults(results) {
      this.set('mostRecentSearchResults', results);
    },
    prepareReview() {
      this.set('currentStep', this.steps[3]);
    },
    uploadAnswers() {
      this.set('isUploadingAnswer', true);
      let rooms = this.selectedRooms;

      if (!rooms) {
        return this.set(
          'invalidRoomsError',
          'At least one room must be selected'
        );
      }
      let importRequest = this.store.createRecord('vmt-import-request', {
        workspaceOwner: this.workspaceOwner,
        workspaceName: this.workspaceName,
        workspaceMode: this.workspaceMode,
        folderSet: this.folderSet,
        doCreateWorkspace: this.doCreateWs,
        vmtRooms: rooms,
        permissionObjects: this.permissionObjects || [],
      });
      importRequest
        .save()
        .then((results) => {
          this.set('isUploadingAnswer', false);
          if (results.get('createdWorkspace.content')) {
            this.set('createdWorkspace', results.get('createdWorkspace'));
            this.sendAction('toWorkspaces', results.get('createdWorkspace'));

            this.alert.showToast(
              'success',
              'Workspace Created',
              'bottom-end',
              4000,
              false,
              null
            );
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
      if (this.assignmentName) {
        this.send('createAssignment');
      } else {
        this.send('uploadAnswers');
      }
    },
  },
});
