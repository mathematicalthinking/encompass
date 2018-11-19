Encompass.NewFoldersetFormComponent = Ember.Component.extend({
  elementId: 'new-folderset-form',
  privacySetting: 'M',

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
  }
});