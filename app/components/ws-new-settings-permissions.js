/*global _:false */
Encompass.WsNewSettingsPermissionsComponent = Ember.Component.extend({
  elementId: 'ws-new-settings-permissions',
  utils: Ember.inject.service('utility-methods'),

  globalItems: {
    groupName: 'global',
    groupLabel: 'Global Permissions',
    required: true,
    inputs: [
      { label: 'View Only', value: 'viewOnly' },
      { label: 'Editor', value: 'editor' },
    ]
  },
  buildPermissionsObject() {
    const user = this.get('selectedCollaborator');
    const globalSetting = this.get('global');

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
      results.folders = 4;
      results.selections = 4;
      results.comments = 4;
      results.feedback = 'preAuth';

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
      const user = this.get('store').peekRecord('user', val);
      this.set('selectedCollaborator', user);
    },
    removeCollab(permissionObj) {
      if (this.get('utils').isNonEmptyObject(permissionObj)) {
        this.get('permissions').removeObject(permissionObj);
      }
    },
    editCollab(permissionObj) {
      const utils = this.get('utils');
      if (utils.isNonEmptyObject(permissionObj)) {
        const user = permissionObj.user;
        if (utils.isNonEmptyObject(user)) {
          this.set('selectedCollaborator', user);
        }
      }
    },

    savePermissions() {
      const permissionsObject = this.buildPermissionsObject();

      if (!this.get('utils').isNonEmptyObject(permissionsObject)) {
        return;
      }
      const permissions = this.get('permissions');
      // check if user already is in array
      let existingObj = permissions.findBy('user', permissionsObject.user);

      // remove existing permissions obj and add modified one
      if (existingObj) {
        permissions.removeObject(existingObj);
      }

      this.get('permissions').addObject(permissionsObject);

      // clear selectedCollaborator
      // clear selectize input

      this.set('selectedCollaborator', null);
      this.$('select#collab-select')[0].selectize.clear();

    },
  }

});