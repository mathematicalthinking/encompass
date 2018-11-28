Encompass.WsPermissionsNewComponent = Ember.Component.extend({
  elementId: 'ws-permissions-new',
  utils: Ember.inject.service('utility-methods'),

  showCustom: Ember.computed.equal('global', 'custom'),

  global: 'viewOnly',
  answerItems: {
    groupName: 'answers',
    groupLabel: 'Answer Permissions',
    required: true,
    inputs: [
      { label: 'All', value: 'all' },
      { label: 'Own Only', value: 'mine' }
    ]
  },

  folderItems: {
    groupName: 'folders',
    groupLabel: 'Folder Permissions',
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
    required: true,
    inputs: [
      { label: 'View Only', value: 'viewOnly' },
      { label: 'Editor', value: 'editor' },
      { label: 'Custom', value: 'custom' }
    ]
  },

  folders: 1,
  answers: 'all',
  comments: 1,
  selections: 1,
  feedback: 'authReq',

  buildPermissionsObject() {
    const user = this.get('selectedUser');
    const globalSetting = this.get('global');
    const answers = this.get('answers');

    const results = {
      user,
      answers,
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
    }
  }

});