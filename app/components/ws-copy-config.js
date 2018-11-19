Encompass.WsCopyConfigComponent = Ember.Component.extend({
  elementId: 'ws-copy-config',
  showCustomConfig: Ember.computed.equal('selectedConfig', 'D'),
  utils: Ember.inject.service('utility-methods'),

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
      this.get('onProceed')(this.get('selectedConfig'));
    }
  }
});