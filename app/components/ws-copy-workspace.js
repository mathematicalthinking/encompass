Encompass.WsCopyWorkspaceComponent = Ember.Component.extend({
  elementId: 'ws-copy-workspace',
  utils: Ember.inject.service('utility-methods'),

  didReceiveAttrs() {
    this._super(...arguments);
  },

  actions: {
    setSelectedWorkspace(val, $item) {
      if (!val) {
        return;
      }
      const workspace = this.get('store').peekRecord('workspace', val);
      if (this.get('utils').isNullOrUndefined(workspace)) {
        return;
      }

      this.set('selectedWorkspace', workspace);
    },
    next() {
      this.get('onProceed')();
    }
  }


});