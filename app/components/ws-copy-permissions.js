Encompass.WsCopyPermissionsComponent = Ember.Component.extend({
  elementId: 'ws-copy-permissions',
  utils: Ember.inject.service('utility-methods'),
  permissions: [],

  actions: {
    setCollaborator(val, $item) {
      if (!val) {
        return;
      }
      const user = this.get('store').peekRecord('user', val);
      this.set('selectedCollaborator', user);
    },
    savePermissions(permissionsObject) {
      if (!this.get('utils').isNonEmptyObject) {
        return;
      }

      this.get('permissions').addObject(permissionsObject);

      // clear selectedCollaborator
      // clear selectize input

      this.set('selectedCollaborator', null);
      this.$('select#collab-select')[0].selectize.clear();

    },
    next() {
      this.get('onProceed')(this.get('permissions'));
    }
  }
});