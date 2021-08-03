/*global _:false */
import { inject as service } from '@ember/service';

import Component from '@ember/component';






export default Component.extend({
  elementId: 'ws-new-settings-permissions',
  utils: service('utility-methods'),
  globalPermissionValue: 'viewOnly',
  globalItems: {
    groupName: 'globalPermissionValue',
    groupLabel: 'Workspace Permissions',
    info: 'Workspace permissions apply to all aspects of a workspace for this user. This means whatever you select applies to all the selections, comments, folders, etc.',
    required: true,
    inputs: [
      { label: 'View Only', value: 'viewOnly', moreInfo: 'This user will be able to see the workspace, but not add or make any changes' },
      {
        label: 'Editor',
        value: 'editor',
        moreInfo: 'This user can add, delete or modify selections, comments, and folders, but they will not be able to see or create new responses'
      },
      {
        label: 'Mentor',
        value: 'indirectMentor',
        moreInfo: 'This user can create selections, comments, and folders. They can also send feedback that will be delivered once approved by a designated feedback approver'
      },
      {
        label: 'Mentor with Direct Send',
        value: 'directMentor',
        moreInfo: 'This user can create selections, comments, and folders. They can also send direct feedback that does not require approval'
      },
      {
        label: 'Approver',
        value: 'approver',
        moreInfo: 'This user can add, delete or modify selections, comments, and folders. They can directly send their own feedback and approve feedback created by other users'
      },]
  },
  buildPermissionsObject() {
    const user = this.selectedCollaborator;
    const globalSetting = this.globalPermissionValue;

    let submissionOptions = {
      all: true
    };

    const results = {
      user,
      submissions: submissionOptions,
      global: globalSetting
    };

    if (globalSetting === 'viewOnly') {
      results.folders = 1;
      results.selections = 1;
      results.comments = 1;
      results.feedback = 'none';

      return results;
    }

    if (globalSetting === 'editor') {
      results.folders = 3;
      results.selections = 4;
      results.comments = 4;
      results.feedback = 'none';

      return results;
    }

    if (globalSetting === 'indirectMentor') {
      results.folders = 2;
      results.selections = 2;
      results.comments = 2;
      results.feedback = 'authReq';

      return results;
    }

    if (globalSetting === 'directMentor') {
      results.folders = 2;
      results.selections = 2;
      results.comments = 2;
      results.feedback = 'preAuth';

      return results;
    }

    if (globalSetting === 'approver') {
      results.folders = 3;
      results.selections = 4;
      results.comments = 4;
      results.feedback = 'approver';

      return results;
    }
  },
  actions: {
    setCollaborator(val, $item) {
      if (!val) {
        return;
      }

      const isRemoval = _.isNull($item);
      if (isRemoval) {
        this.set('selectedCollaborator', null);
        return;
      }
      const user = this.store.peekRecord('user', val);
      this.set('selectedCollaborator', user);
      this.set('isEditing', true);
    },
    removeCollab(permissionObj) {
      if (this.utils.isNonEmptyObject(permissionObj)) {
        this.permissions.removeObject(permissionObj);
      }
    },
    editCollab(permissionObj) {
      const utils = this.utils;
      if (utils.isNonEmptyObject(permissionObj)) {
        const user = permissionObj.user;
        if (utils.isNonEmptyObject(user)) {
          this.set('selectedCollaborator', user);
          this.set('isEditing', true);
        }
      }
    },

    savePermissions() {
      const permissionsObject = this.buildPermissionsObject();

      if (!this.utils.isNonEmptyObject(permissionsObject)) {
        return;
      }
      const permissions = this.permissions;
      // check if user already is in array
      let existingObj = permissions.findBy('user', permissionsObject.user);

      // remove existing permissions obj and add modified one
      if (existingObj) {
        permissions.removeObject(existingObj);
      }

      this.permissions.addObject(permissionsObject);

      // clear selectedCollaborator
      // clear selectize input

      this.set('selectedCollaborator', null);
      this.$('select#collab-select')[0].selectize.clear();
      this.set('isEditing', false);

    },
  }

});