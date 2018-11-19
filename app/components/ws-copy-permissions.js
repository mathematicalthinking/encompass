Encompass.WsCopyPermissionsComponent = Ember.Component.extend({
  elementId: 'ws-copy-permissions',

  actions: {
    submit() {
      this.get('createCopyRequest')();
    }
  }
});