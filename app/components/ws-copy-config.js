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
    if (this.get('utils').isNullOrUndefined(newWsConfig)) {
      this.set('selectedConfig', 'A');
    } else {
      this.set('selectedConfig', newWsConfig);
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