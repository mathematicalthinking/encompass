/*global _:false */
Encompass.WsPermissionsNewComponent = Ember.Component.extend({
  elementId: 'ws-permissions-new',
  utils: Ember.inject.service('utility-methods'),
  showCustomSubmissions: function() {
    return this.get('submissions') === 'custom' && this.get('showCustomSubmissionViewer');
  }.property('submissions', 'showCustomSubmissionViewer'),
  showCustomSubmissionViewer: true,
  closedCustomView: function() {
    return this.get('submissions') === 'custom' && !this.get('showCustomSubmissionViewer');
  }.property('showCustomSubmissionViewer', 'submissions'),

  global: 'viewOnly',
  submissionItems: {
    groupName: 'submissions',
    groupLabel: 'Accessible Submissions',
    info: 'Accessible submissions dictate what submissions this user will see in the workspace. Hover over the question marks for more info',
    required: true,
    inputs: [
      {
        label: 'All',
        value: 'all',
      }, {
        label: 'Own Only',
        value: 'userOnly',
        moreInfo: 'If the user is the creator of any submission in this workspace, they will only see those',
      }, {
        label: 'Custom',
        value: 'custom',
        moreInfo: 'View all submissions and select specific ones this user can see',
      }
    ]
  },

  folderItems: {
    groupName: 'folders',
    groupLabel: 'Folder Permissions',
    info: 'Folder permissions decide what users can do with folders in this workspace. Delete is the highest setting which means this user can do anything related to folders',
    required: true,
    inputs: [
      {
        label: 'None',
        value: 0,
        moreInfo: 'User will see no folders',
      }, {
        label: 'View Only',
        value: 1,
        moreInfo: 'User will be able to see folders',
      }, {
        label: 'Create',
        value: 2,
        moreInfo: 'User will be able to see add folders ',
      }, {
        label: 'Edit',
        value: 3,
        moreInfo: 'User will be able to see, add and edit folders',
      }, {
        label: 'Delete',
        value: 4,
        moreInfo: 'User will be able to see, add, edit and delete folders',
      }
    ]
  },
  selectionItems: {
    groupName: 'selections',
    groupLabel: 'Selection Permissions',
    info: 'Selection permissions decide what users can do with selections in this workspace. Delete is the highest setting which means this user can do anything related to selections',
    required: true,
    inputs: [
      {
        label: 'None',
        value: 0,
        moreInfo: 'User will see no selections',
      }, {
        label: 'View Only',
        value: 1,
        moreInfo: 'User will be able to see selections',
      }, {
        label: 'Create',
        value: 2,
        moreInfo: 'User will be able to see add selections ',
      }, {
        label: 'Edit',
        value: 3,
        moreInfo: 'User will be able to see, add and edit selections',
      }, {
        label: 'Delete',
        value: 4,
        moreInfo: 'User will be able to see, add, edit and delete selections',
      }
    ]
  },
  commentItems: {
    groupName: 'comments',
    groupLabel: 'Comment Permissions',
    info: 'Comment permissions decide what users can do with comments in this workspace. Delete is the highest setting which means this user can do anything related to comments',
    required: true,
    inputs: [
      {
        label: 'None',
        value: 0,
        moreInfo: 'User will see no comments',
      }, {
        label: 'View Only',
        value: 1,
        moreInfo: 'User will be able to see comments',
      }, {
        label: 'Create',
        value: 2,
        moreInfo: 'User will be able to see add comments ',
      }, {
        label: 'Edit',
        value: 3,
        moreInfo: 'User will be able to see, add and edit comments',
      }, {
        label: 'Delete',
        value: 4,
        moreInfo: 'User will be able to see, add, edit and delete comments',
      }
    ]
  },

  feedbackItems: {
    groupName: 'feedback',
    groupLabel: 'Feedback Permissions',
    info: 'Feedback permissions dictate whether this user can send feedback to the creator of the submissions. Hover over the question marks for more info.',
    required: true,
    inputs: [
      {
        label: 'None',
        value: 'none',
        moreInfo: 'User will not be able to see feedback',
      }, {
        label: 'Authorization Required',
        value: 'authReq',
        moreInfo: 'User can send feeback but the owner will have to approve it first',
      }, {
        label: 'Pre-authorized',
        value: 'preAuth',
        moreInfo: 'User can send feedback directly to students without approval',
      }
    ]
  },
  globalItems: {
    groupName: 'global',
    groupLabel: 'Workspace Permissions',
    info: 'Workspace permissions apply to all aspects of a worksapce for this user. This means whatever you select applies to all the selections, comments, folders, etc.',
    required: true,
    inputs: [
      {
        label: 'View Only',
        value: 'viewOnly',
        moreInfo: 'This user will be able to see the workspace, but not add or make any changes',
      },
      {
        label: 'Editor',
        value: 'editor',
        moreInfo: 'This user can add, delete or modify everything in this workspace',
      },
      {
        label: 'Custom',
        value: 'custom',
        moreInfo: 'Select this if you want to set permissions for each aspect of a workspace',
      }
    ]
  },

  folders: 1,
  submissions: 'all',
  comments: 1,
  selections: 1,
  feedback: 'authReq',
  customSubmissionIds: [],

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

  isShowingCustomSubs: function() {
    this.set('isShowingSubView', this.get('showCustomSubmissions'));
  }.observes('showCustomSubmissions'),

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
      if (this.get('saveError')) {
        this.set('saveError', null);
      }
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
    },
    stopEditing() {
      this.get('stopEditing')();
    },
    selectAllSubmissions: function () {
      this.set('customSubmissionIds', this.get('workspace.submissions').mapBy('id'));
    },
    deselectAllSubmissions: function () {
      this.set('customSubmissionIds', []);
    },
  }

});