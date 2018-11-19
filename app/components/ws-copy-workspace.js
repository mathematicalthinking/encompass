Encompass.WsCopyWorkspaceComponent = Ember.Component.extend({
  elementId: 'ws-copy-workspace',
  utils: Ember.inject.service('utility-methods'),

  didReceiveAttrs() {
    this._super(...arguments);
    const workspaceToCopy = this.get('workspaceToCopy');
    if (this.get('utils').isNonEmptyObject(workspaceToCopy) && this.get('utils').isNullOrUndefined(this.get('selectedWorkspace'))) {
      this.set('selectedWorkspace', workspaceToCopy);
    }
  },

  initialWorkspaceItem: function() {
    const selectedWorkspace = this.get('selectedWorkspace');
    if (this.get('utils').isNonEmptyObject(selectedWorkspace)) {
      return [selectedWorkspace.id];
    }
    return [];
  }.property('selectedWorkspace'),

  initialWorkspaceOptions: function() {
    const selectedWorkspace = this.get('selectedWorkspace');

    if (this.get('utils').isNonEmptyObject(selectedWorkspace)) {
      return [
        {
        id: selectedWorkspace.id,
        name: selectedWorkspace.get('name')
      }
    ];
  }
  return [];
}.property('selectedWorkspace'),

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