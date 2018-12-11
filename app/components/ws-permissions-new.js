/*global _:false */
Encompass.WsPermissionsNewComponent = Ember.Component.extend({
  elementId: 'ws-permissions-new',
  utils: Ember.inject.service('utility-methods'),

  showCustom: Ember.computed.equal('global', 'custom'),
  showCustomSubmissions: Ember.computed.equal('submissions', 'custom'),

  global: 'viewOnly',
  submissionItems: {
    groupName: 'submissions',
    groupLabel: 'Submission Permissions',
    info: 'Submission permissions dictate what submissions this user will see in the workspace. Hover over the question marks for more info',
    required: true,
    inputs: [
      { label: 'All', value: 'all' },
      { label: 'Own Only', value: 'userOnly' },
      { label: 'Custom', value: 'custom' }
    ]
  },

  folderItems: {
    groupName: 'folders',
    groupLabel: 'Folder Permissions',
    info: 'Folder permissions decide what users can do with folders in this workspace. Delete is the highest setting which means this user can do anything related to folders',
    required: true,
    inputs: [
      { label: 'None', value: 0 },
      { label: 'View Only', value: 1 },
      { label: 'Create', value: 2 },
      { label: 'Edit', value: 3 },
      { label: 'Delete', value: 4 }
    ]
  },
  selectionItems: {
    groupName: 'selections',
    groupLabel: 'Selection Permissions',
    info: 'Selection permissions decide what users can do with selections in this workspace. Delete is the highest setting which means this user can do anything related to selections',
    required: true,
    inputs: [
      { label: 'None', value: 0 },
      { label: 'View Only', value: 1 },
      { label: 'Create', value: 2 },
      { label: 'Edit', value: 3 },
      { label: 'Delete', value: 4 }
    ]
  },
  commentItems: {
    groupName: 'comments',
    groupLabel: 'Comment Permissions',
    info: 'Comment permissions decide what users can do with comments in this workspace. Delete is the highest setting which means this user can do anything related to comments',
    required: true,
    inputs: [
      { label: 'None', value: 0 },
      { label: 'View Only', value: 1 },
      { label: 'Create', value: 2 },
      { label: 'Edit', value: 3 },
      { label: 'Delete', value: 4 }
    ]
  },

  feedbackItems: {
    groupName: 'feedback',
    groupLabel: 'Feedback Permissions',
    info: 'Feedback permissions dictate whether this user can send feedback to the creator of the submissions. Hover over the question marks for more info.',
    required: true,
    inputs: [
      { label: 'None', value: 'none' },
      { label: 'Authorization Required', value: 'authReq' },
      { label: 'PreAuthorized', value: 'preAuth' }
    ]
  },
  globalItems: {
    groupName: 'global',
    groupLabel: 'Global Permissions',
    info: 'Global permissions apply to all aspects of a worksapce for this user. This means whatever you select applies to all the selections, comments, folders, etc.',
    required: true,
    inputs: [
      { label: 'View Only', value: 'viewOnly' },
      { label: 'Editor', value: 'editor' },
      { label: 'Custom', value: 'custom' }
    ]
  },

  folders: 1,
  submissions: 'all',
  comments: 1,
  selections: 1,
  feedback: 'authReq',

  didReceiveAttrs() {
    const selectedUserId = this.get('selectedUser.id');
    const permissions = this.get('permissions');
    const utils = this.get('utils');

   if (!utils.isNullOrUndefined(selectedUserId) && utils.isNonEmptyArray(permissions)) {
     const userPermissions = permissions.find((obj) => {
      let user = obj.user;
      if (utils.isNonEmptyObject(user)) {
        return user.get('id') === selectedUserId;
      }
      return user === selectedUserId;
     });

     if (utils.isNonEmptyObject(userPermissions)) {
      //prefill for editing
      _.each(['folders', 'comments', 'selections', 'feedback', 'global'], (prop) => {
        let val = userPermissions[prop];
        if (!utils.isNullOrUndefined(val)) {
          this.set(prop, val);
        }
      });

      const submissions = userPermissions.submissions;
      if (utils.isNonEmptyObject(submissions)) {
        if (submissions.all === true) {
          this.set('submissions', 'all');
        } else if (submissions.userOnly === true) {
          this.set('submissions', 'userOnly');
        } else if (_.isArray(submissions.submissionIds)) {
          this.set('submissions', 'custom');
          this.set('customSubmissionIds', [...submissions.submissionIds]);
        }
      }
     }
   }
  },

  willDestroyElement() {
    this.set('selectedUser', null);
    this._super(...arguments);
  },

  buildCustomSubmissionIds(submissionsValue) {
    if (submissionsValue === 'custom') {
      let ids = this.get('customSubmissionIds');
      if (this.get('utils').isNonEmptyArray(ids)) {
        return ids;
      }
      return [];
    } else if (submissionsValue === 'userOnly') {
      // filter for only submissions that have selectedUser as student
      const subs = this.get('workspace.submissions.content');
      const selectedUsername = this.get('selectedUser.username');
      const selectedUserId = this.get('selectedUser.id');
      if (subs) {
        const filtered = subs.filter((sub) => {
          return sub.get('creator.studentId') === selectedUserId|| sub.get('creator.username') === selectedUsername;
        });
        return filtered.mapBy('id');
      }

    }
    return [];
  },

  buildPermissionsObject() {
    const user = this.get('selectedUser');
    const globalSetting = this.get('global');
    const submissions = this.get('submissions');

    const includeAllSubs = submissions === 'all';
    let submissionOptions = {
      all: includeAllSubs,
      submissionIds: []
    };

    if (!includeAllSubs) {
      submissionOptions.submissionIds = this.buildCustomSubmissionIds(submissions);
    }


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
      results.folders = 4;
      results.selections = 4;
      results.comments = 4;
      results.feedback = 'preAuth';

      return results;
    }
    results.folders = this.get('folders');
    results.selections = this.get('selections');
    results.comments = this.get('comments');
    results.feedback = this.get('feedback');

    return results;
  },

  actions: {
    savePermissions() {
      const permissions = this.buildPermissionsObject();
      if (this.get('utils').isNonEmptyObject(permissions)) {
        this.get('onSave')(permissions);
        return;
      }
      this.set('saveError', true);
    },
    updateCustomSubs(id) {
      if (!this.get('utils').isNonEmptyArray(this.get('customSubmissionIds'))) {
        this.set('customSubmissionIds', []);
      }

      const customSubmissionIds = this.get('customSubmissionIds');

      const isIn = customSubmissionIds.includes(id);
      if (isIn) {
        // remove
        customSubmissionIds.removeObject(id);
      } else {
        //add
        customSubmissionIds.addObject(id);
      }

    }
  }

});