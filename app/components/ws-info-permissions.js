/*global _:false */
import { inject as service } from '@ember/service';

import Component from '@ember/component';






export default Component.extend({
  elementId: 'ws-info-permissions',

  utils: service('utility-methods'),

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
    },
    savePermissions(permissionsObject) {
      this.savePermissions(permissionsObject);
    },
  }

});