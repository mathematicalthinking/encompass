import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
/*global _:false */
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  elementId: 'import-work-step5',
  creatingWs: equal('doCreateWs', true),
  creatingAssignment: equal('createAssignmentValue', true),
  utils: service('utility-methods'),
  workspaceOwner: null,
  workspaceMode: null,
  folderSet: null,
  assignmentName: null,
  createWs: {
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
  },
  createAssignment: {
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
  },
  ownerOptions: computed('users.[]', function () {
    if (this.users) {
      return this.users.map((user) => {
        return {
          id: user.get('id'),
          username: user.get('username'),
        };
      });
    }
    return [];
  }),
  modeInputs: computed(
    'currentUser.isStudent',
    'currentUser.isAdmin',
    function () {
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
    }
  ),

  initialOwnerItem: computed('selectedOwner', function () {
    const selectedOwner = this.selectedOwner;
    if (selectedOwner && this.utils.isNonEmptyObject(selectedOwner)) {
      return [selectedOwner.id];
    }
    return [];
  }),

  initialFolderSetItem: computed('selectedFolderSet', function () {
    const selectedFolderSet = this.selectedFolderSet;
    if (this.utils.isNonEmptyObject(selectedFolderSet)) {
      return [selectedFolderSet.id];
    }
    return [];
  }),

  willDestroyElement: function () {
    this.set('doCreateWs', this.doCreateWs);
    this.set('createAssignmentValue', this.createAssignmentValue);
    this.set('selectedMode', this.selectedMode);
    this.set('workspaceName', this.workspaceName);
  },

  actions: {
    updateSelectizeSingle(val, $item, propToUpdate, model) {
      if (_.isNull($item)) {
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
      this.set('workspaceName', this.workspaceName);
      this.set('workspaceOwner', this.selectedOwner);
      this.set('workspaceMode', this.selectedMode);
      this.set('folderSet', this.selectedFolderSet);
      if (!this.workspaceName || !this.selectedOwner) {
        if (!this.workspaceName) {
          this.set(
            'missingNameError',
            'Please provide a name for your workspace'
          );
        }
        if (!this.selectedOwner) {
          this.set(
            'missingOwnerError',
            'Please provide an owner for your workspace'
          );
        }
      } else {
        this.set('createWorkspaceError', null);
        this.onProceed();
      }
    },

    next() {
      if (this.createAssignmentValue) {
        if (!this.assignmentName) {
          this.set(
            'missingAssignmentError',
            'Please provide a name for your assignment'
          );
        }
        this.set('assignmentName', this.assignmentName);
      } else {
        this.set('assignmentName', null);
      }
      if (this.doCreateWs) {
        this.send('createWorkspace');
      } else {
        this.set('workspaceName', null);
        this.set('workspaceOwner', null);
        this.set('workspaceMode', null);
        this.set('folderSet', null);
        this.onProceed();
      }
      //check for assignment and set assignmentName
    },
    back() {
      this.onBack(-1);
    },
  },
});
