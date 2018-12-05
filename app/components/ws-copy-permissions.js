/*global _:false */
Encompass.WsCopyPermissionsComponent = Ember.Component.extend({
  elementId: 'ws-copy-permissions',
  utils: Ember.inject.service('utility-methods'),

  didReceiveAttrs() {
    // set already saved permissions in case user went back to previous step and then came back to permissions
    const newWsPermissions = this.get('newWsPermissions');
    if (_.isArray(newWsPermissions)) {
      this.set('permissions', [...newWsPermissions]);
    } else {
      this.set('permissions', []);
    }
    this._super(...arguments);
  },

  willDestroyElement() {
    // clearing permissions as potential fix to issue of phantom collaborators displaying
    this.set('permissions', []);
    this._super(...arguments);
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
    savePermissions(permissionsObject) {
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
    next() {
      this.get('onProceed')(this.get('permissions'));
    },

    back() {
      this.get('onBack')(-1);
    }
  }
});