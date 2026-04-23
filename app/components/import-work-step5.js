import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { service } from '@ember/service';

export default Component.extend({
  tagName: '',
  creatingWs: equal('doCreateWs', true),
  creatingAssignment: equal('createAssignmentValue', true),
  utils: service('utility-methods'),
  alert: service('sweet-alert'),
  workspaceOwner: null,
  workspaceMode: null,
  folderSet: null,
  assignmentName: null,
  createWs: computed(function () {
    return {
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
  }),
  createAssignment: computed(function () {
    return {
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
  }),
  ownerOptions: computed('users.[]', function () {
    if (this.users) {
      return this.users.map((user) => {
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
    return [];
  }),

  folderSetOptions: computed('folderSets.[]', function () {
    if (!Array.isArray(this.folderSets)) {
      return [];
    }
    return this.folderSets.map((folderSet) => {
      const getValue =
        typeof folderSet?.get === 'function'
          ? (prop) => folderSet.get(prop)
          : (prop) => folderSet?.[prop];
      return {
        id: getValue('id') || getValue('_id'),
        name: getValue('name') || '',
      };
    });
  }),
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

    if (this.currentUser?.isStudent || !this.currentUser?.isAdmin) {
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

  initialOwnerItem: computed('selectedOwner', 'utils', function () {
    const selectedOwner = this.selectedOwner;
    if (selectedOwner && this.utils.isNonEmptyObject(selectedOwner)) {
      return [selectedOwner.id];
    }
    return [];
  }),

  initialFolderSetItem: computed('selectedFolderSet', 'utils', function () {
    const selectedFolderSet = this.selectedFolderSet;
    if (this.utils.isNonEmptyObject(selectedFolderSet)) {
      return [selectedFolderSet.id];
    }
    return [];
  }),

  normalizeTextValue(value) {
    return typeof value === 'string' ? value.trim() : value;
  },

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
  },

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
  },

  actions: {
    updateDoCreateWs: function (val) {
      this.set('doCreateWs', val);
    },
    updateSelectedMode: function (val) {
      this.set('selectedMode', val);
    },
    updateCreateAssignmentValue: function (val) {
      this.set('createAssignmentValue', val);
    },
    updateSelectizeSingle(val, $item, propToUpdate, model) {
      if (this.utils.isNullOrUndefined($item)) {
        this.set(propToUpdate, null);
        return;
      }
      let record = this.store.peekRecord(model, val);
      if (!record) {
        return;
      }
      this.set(propToUpdate, record);
    },
    createWorkspace() {
      const workspaceName = this.normalizeTextValue(this.workspaceName);
      this.set('workspaceName', workspaceName);
      this.set('workspaceOwner', this.selectedOwner || null);
      this.set('workspaceMode', this.selectedMode || 'private');
      this.set('folderSet', this.selectedFolderSet || null);
      if (!workspaceName || !this.selectedOwner) {
        if (!workspaceName) {
          this.set(
            'missingNameError',
            'Please provide a name for your workspace'
          );
        } else {
          this.set('missingNameError', null);
        }
        if (!this.selectedOwner) {
          this.set(
            'missingOwnerError',
            'Please provide an owner for your workspace'
          );
        } else {
          this.set('missingOwnerError', null);
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
      } else {
        this.set('missingNameError', null);
        this.set('missingOwnerError', null);
        this.set('createWorkspaceError', null);
        if (typeof this.onProceed === 'function') {
          this.onProceed(this.buildReviewPayload({ doCreateWs: true }));
        }
      }
    },

    next() {
      let hasAssignmentError = false;
      if (this.createAssignmentValue) {
        let assignmentName =
          typeof this.assignmentName === 'string'
            ? this.assignmentName.trim()
            : this.assignmentName;

        if (!assignmentName) {
          this.set(
            'missingAssignmentError',
            'Please provide a name for your assignment'
          );
          hasAssignmentError = true;
        } else {
          this.set('missingAssignmentError', null);
        }
        this.set('assignmentName', assignmentName);
      } else {
        this.set('missingAssignmentError', null);
        this.set('assignmentName', null);
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
        this.send('createWorkspace');
      } else {
        this.set('missingNameError', null);
        this.set('missingOwnerError', null);
        this.set('createWorkspaceError', null);
        if (typeof this.onProceed === 'function') {
          this.onProceed(this.buildReviewPayload({ doCreateWs: false }));
        }
      }
      //check for assignment and set assignmentName
    },
    back() {
      this.onBack(-1);
    },
  },
});
