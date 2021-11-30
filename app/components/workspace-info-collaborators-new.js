import Component from '@ember/component';
import _ from 'underscore';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service('current-user'),
  elementId: ['workspace-info-collaborators-new'],
  utils: service('utility-methods'),
  alert: service('sweet-alert'),
  store: service(),
  globalPermissionValue: 'viewOnly',
  showCustom: equal('globalPermissionValue', 'custom'),
  mainPermissions: [
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
  ],
  feedbackPermissions: [
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
  ],
  submissionPermissions: [
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
  ],

  actions: {
    updateGlobalPermissionValue: function (val) {
      this.set('globalPermissionValue', val);
    },
    setCollab(val, $item) {
      if (!val) {
        return;
      }
      let existingCollab = this.get('workspace.collaborators');
      const user = this.store.peekRecord('user', val);
      let alreadyCollab = _.contains(existingCollab, user.get('id'));

      if (alreadyCollab) {
        this.set('existingUserError', true);
        return;
      }
      if (this.utils.isNonEmptyObject(user)) {
        this.set('collabUser', user);
      }
    },

    saveCollab() {
      if (!this.collabUser) {
        this.set('missingUserError', true);
        return;
      }
      let ws = this.workspace;
      let permissions = ws.get('permissions');

      let subValue = this.get('submissions.value');

      let newObj = {
        user: this.get('collabUser.id'),
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
        newObj.selections = this.get('selections.value') || 0;
        newObj.folders = this.get('folders.value') || 0;
        newObj.comments = this.get('comments.value') || 0;
        newObj.feedback = this.get('feedback.value') || 'none';

        if (subValue === 'all') {
          newObj.submissions.all = true;
        } else if (subValue === 'userOnly') {
          newObj.submissions.userOnly = true;
        } else if (subValue === 'custom') {
          newObj.submissions.submissionIds = this.customSubmissionIds;
        }
      }
      this.originalCollaborators.addObject(this.collabUser);

      permissions.addObject(newObj);

      ws.save().then(() => {
        this.alert.showToast(
          'success',
          `${this.collabUser.get('username')} added as collaborator`,
          'bottom-end',
          3000,
          null,
          false
        );
        this.cancelEditCollab();
      });
    },
    toggleSubmissionView: function () {
      this.toggleIsShowingCustomViewer();
    },
    cancelCreateCollab: function () {
      this.cancelEditCollab();
    },
  },
});
