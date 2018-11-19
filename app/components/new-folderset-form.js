Encompass.NewFoldersetFormComponent = Ember.Component.extend({
  elementId: 'new-folderset-form',
  privacySetting: 'M',
  utils: Ember.inject.service('utility-methods'),

  didReceiveAttrs() {
    if (this.get('utils').isNullOrUndefined(this.get('privacySetting'))) {
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
        isChecked: true
      },
      {
        value: 'O',
        label: 'My Org',
        isChecked: false
      },
      {
        value: 'E',
        label: 'Public',
        isChecked: false
      },
    ]
  },

});