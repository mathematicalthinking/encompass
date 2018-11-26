/*global _:false */
Encompass.WsInfoPermissionsComponent = Ember.Component.extend({
  elementId: 'ws-info-permissions',

  utils: Ember.inject.service('utility-methods'),

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
    savePermissions(permissionsObject) {
      this.get('savePermissions')(permissionsObject);
    },
  }

});