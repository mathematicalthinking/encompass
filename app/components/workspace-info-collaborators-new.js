import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  elementId: ['workspace-info-collaborators-new'],
  utils: service('utility-methods'),
  alert: service('sweet-alert'),
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

  modes: computed('currentUser.isAdmin', 'currentUser.isStudent', function () {
    const basic = ['private', 'org', 'public'];

    if (this.currentUser.isStudent || !this.currentUser.isAdmin) {
      return basic;
    }

    return ['private', 'org', 'public', 'internet'];
  }),

  createValueObject(val) {
    let obj = {
      id: null,
      display: null,
      value: val,
    };
    switch (val) {
      case 0:
        obj.display = 'Hidden';
        obj.id = 1;
        break;
      case 1:
        obj.display = 'View Only';
        obj.id = 2;
        break;
      case 2:
        obj.display = 'Create';
        obj.id = 3;
        break;
      case 3:
        obj.display = 'Add';
        obj.id = 4;
        break;
      case 4:
        obj.display = 'Delete';
        obj.id = 5;
        break;
      case 'none':
        obj.display = 'None';
        obj.id = 1;
        break;
      case 'authReq':
        obj.display = 'Approval Required';
        obj.id = 2;
        break;
      case 'preAuth':
        obj.display = 'Pre-Approved';
        obj.id = 3;
        break;
      case 'approver':
        obj.display = 'Approver';
        obj.id = 4;
        break;
      default:
        break;
    }
    return obj;
  },

  createSubmissionValueObject(subObj) {
    let obj = {
      id: null,
      display: null,
      value: null,
    };
    if (subObj.all) {
      obj.id = 1;
      obj.value = 'all';
      obj.display = 'All';
    } else if (subObj.userOnly) {
      obj.id = 2;
      obj.value = 'userOnly';
      obj.display = 'Own Only';
    } else {
      obj.id = 3;
      obj.value = 'custom';
      obj.display = 'Custom';
      this.set('customSubIds', subObj.submissionIds);
    }
    return obj;
  },

  buildCustomSubmissionIds(submissionsValue) {
    if (submissionsValue === 'custom') {
      let ids = this.customSubmissionIds;
      if (this.utils.isNonEmptyArray(ids)) {
        return ids;
      }
      return [];
    }
    return [];
  },

  actions: {
    setCollab(val, $item) {
      if (!val) {
        return;
      }
      let existingCollab = this.workspace.collaborators;
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

      let subValue = this.submissions.value;

      let newObj = {
        user: this.collabUser.id,
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
        newObj.selections = this.selections.value || 0;
        newObj.folders = this.folders.value || 0;
        newObj.comments = this.comments.value || 0;
        newObj.feedback = this.feedback.value || 'none';

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
        this.set('createNewCollaborator', false);
        this.set('isShowingCustomViewer', false);
      });
    },
    toggleSubmissionView: function () {
      this.set('isShowingCustomViewer', !this.isShowingCustomViewer);
    },
    cancelCreateCollab: function () {
      this.set('createNewCollaborator', null);
      if (this.isShowingCustomViewer) {
        this.set('isShowingCustomViewer', false);
      }
    },
  },
});
