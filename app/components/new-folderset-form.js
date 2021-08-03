import { inject as service } from '@ember/service';
import Component from '@ember/component';






export default Component.extend({
  elementId: 'new-folderset-form',
  privacySetting: 'M',
  utils: service('utility-methods'),

  didReceiveAttrs() {
    if (this.utils.isNullOrUndefined(this.privacySetting)) {
      this.set('privacySetting', 'M');
    }
    this._super(...arguments);
  },

  privacyInputs: {
    groupName: 'privacySetting',
    required: true,
    inputs: [
      {
        value: 'M',
        label: 'Private',
        isChecked: true,
        moreInfo: 'Only you will be able to see and reuse this folder set',

      },
      {
        value: 'O',
        label: 'My Org',
        isChecked: false,
        moreInfo: 'All members of your org will be able to see and reuse this folder set',

      },
      {
        value: 'E',
        label: 'Public',
        isChecked: false,
        moreInfo: 'All Encompass users will be able to see and reuse this folder set',
      },
    ]
  },

});