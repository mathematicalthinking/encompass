Encompass.WsCopyConfigComponent = Ember.Component.extend({
  elementId: 'ws-copy-config',
  showCustomConfig: Ember.computed.equal('selectedConfig', 'D'),
  utils: Ember.inject.service('utility-methods'),

  validConfigValues: function() {
    const configInputs = this.get('copyConfig.inputs');

    if (this.get('utils').isNonEmptyArray(configInputs)) {
      return configInputs.map(input => input.value);
    }
    return [];

  }.property('copyConfig'),

  didReceiveAttrs() {
    const newWsConfig = this.get('newWsConfig');
    const selectedConfig = this.get('selectedConfig');

    const validValues = this.get('validConfigValues');
    // if reaching via back button, set selectedConfig to previously selected value
    // else set as A
    if (validValues.includes(newWsConfig)) {
      this.set('selectedConfig', newWsConfig);
    } else if (!validValues.includes(selectedConfig)) {
      this.set('selectedConfig', 'A');
    }

    this._super(...arguments);
  },

  actions: {
    next() {
      const selectedConfig = this.get('selectedConfig');
      const validConfigValues = this.get('validConfigValues');

      if (validConfigValues.includes(selectedConfig)) {
        this.get('onProceed')(this.get('selectedConfig'));
        return;
      }
      this.set('invalidOrMissingConfig', true);
    },

    nextCustom(customConfig) {
      this.get('onProceed')(this.get('selectedConfig'), customConfig);
    },
    back() {
      this.get('onBack')(-1);
    }
  }
});