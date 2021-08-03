import { inject as service } from '@ember/service';
import Component from '@ember/component';






export default Component.extend({
  classNames: ['radio-group'],
  utils: service('utility-methods'),

  actions: {
    setValue(val) {
      if (this.utils.isNullOrUndefined(val)) {
        return;
      }

      this.set('selectedValue', val);
    }
  }

});