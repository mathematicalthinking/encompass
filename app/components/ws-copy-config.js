Encompass.WsCopyConfigComponent = Ember.Component.extend({
  elementId: 'ws-copy-config',
  selectedConfig: 'A',
  showCustomConfig: Ember.computed.equal('selectedConfig', 'D'),

  didReceiveAttrs() {
    this._super(...arguments);
  },

  actions: {
    next() {
      this.get('onProceed')(this.get('selectedConfig'));
    }
  }
});