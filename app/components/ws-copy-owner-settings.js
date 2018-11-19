/*global _:false */
Encompass.WsCopyOwnerSettingsComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'ws-copy-owner-settings',
  selectedMode: 'private',
  folderSetName: null,

  didReceiveAttrs() {
    if (_.isUndefined(this.get('selectedOwner'))) {
      this.set('selectedOwner', this.get('currentUser'));
    }
    if (_.isUndefined(this.get('selectedName'))) {
      this.set('selectedName', `Copy of ${this.get('workspace.name')}`);
    }

    this._super(...arguments);
  },

  actions: {
    next() {
      const name = this.get('selectedName');
      const owner = this.get('selectedOwner');
      const mode = this.get('selectedMode');
      const folderSetOptions = {
        doCreateFolderSet: this.get('doCreateFolderSet'),
        existingFolderSetToUse: this.get('existingFolderSetToUse'),
        name: this.get('folderSetName'),
        privacySetting: this.get('folderSetPrivacy')
      };
      this.get('onProceed')(name, owner, mode, folderSetOptions);
    },
    setOwner(val, $item) {
      if (!val) {
        return;
      }
      const user = this.get('store').peekRecord('user', val);
      this.set('selectedOwner', user);
    },
  }
});