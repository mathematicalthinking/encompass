/*global _:false */
Encompass.WsCopyOwnerSettingsComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'ws-copy-owner-settings',
  utils: Ember.inject.service('utility-methods'),

  constraints: function() {
    return {
      name: {
        presence: { allowEmpty: false },
        length: { maximum: 500 },
      },

      owner: {
        presence: { allowEmpty: false }
      },

      mode: {
        inclusion: {
          within: this.get('validModeValues'),
          message: 'Please select a valid mode.'
        }
      },
      doCreateFolderSet: {
        inclusion: {
          within: [true, false],
          message: ''
        }
      }
    };
  }.property('validModeValues'),

  validModeValues: function() {
    const modeInputs = this.get('modeInputs.inputs');

    if (this.get('utils').isNonEmptyArray(modeInputs)) {
      return modeInputs.map(input => input.value);
    }
    return [];

  }.property('modeInputs'),

  didReceiveAttrs() {
    const newWsOwner = this.get('newWsOwner');
    const newWsName = this.get('newWsName');
    const newWsMode = this.get('newWsMode');
    const newFolderSetOptions = this.get('newFolderSetOptions');
    const utils = this.get('utils');

    if (utils.isNonEmptyObject(newWsOwner)) {
      this.set('selectedOwner', newWsOwner);
    } else if (!utils.isNonEmptyObject(this.get('selectedOwner'))) {
      this.set('selectedOwner', this.get('currentUser'));
    }

    if (utils.isNonEmptyString(newWsName)) {
      this.set('selectedName', newWsName);
    } else if (!utils.isNonEmptyString(this.get('selectedName'))) {
      this.set('selectedName', `Copy of ${this.get('workspace.name')}`);
    }

    if (utils.isNonEmptyString(newWsMode)) {
      this.set('selectedMode', newWsMode);
    } else if (!utils.isNonEmptyString(this.get('selectedMode'))) {
      this.set('selectedMode', 'private');
    }

    if (utils.isNonEmptyObject(newFolderSetOptions)) {
      this.set('doCreateFolderSet', newFolderSetOptions.doCreateFolderSet);
      this.set('folderSetName', newFolderSetOptions.name);
      this.set('folderSetPrivacy', newFolderSetOptions.privacySetting);
      this.set('existingFolderSetToUse', newFolderSetOptions.existingFolderSetToUse);

    } else if (utils.isNullOrUndefined(this.get('doCreateFolderSet'))) {
      this.set('doCreateFolderSet', false);
    }

    this._super(...arguments);
  },

  initialOwnerItem: function() {
    const selectedOwner = this.get('selectedOwner');
    if (this.get('utils').isNonEmptyObject(selectedOwner)) {
      return [selectedOwner.id];
    }
    return [];
  }.property('selectedOwner'),

  initialOwnerOptions: function() {
    const selectedOwner = this.get('selectedOwner');

    if (this.get('utils').isNonEmptyObject(selectedOwner)) {
      return [
        {
        id: selectedOwner.id,
        username: selectedOwner.get('username')
      }
    ];
  }
    return [];
  }.property('selectedOwner'),

  actions: {
    next() {
      const name = this.get('selectedName');
      const owner = this.get('selectedOwner');
      const mode = this.get('selectedMode');


      const doCreateFolderSet = this.get('doCreateFolderSet');

      const errors = window.validate({name, owner, mode, doCreateFolderSet}, this.get('constraints'));

      if (this.get('utils').isNonEmptyObject(errors)) {
        for (let key of Object.keys(errors)) {
          let errorProp = `${key}Errors`;
          this.set(errorProp, errors[key]);
        }
        return;
      }

      // clear old values if the 'No' radio button is selected and next is hit
      if (!doCreateFolderSet) {
        this.set('folderSetName', null);
        this.set('folderSetPrivacy', null);
      }
      const folderSetOptions = {
        doCreateFolderSet: doCreateFolderSet,
        existingFolderSetToUse: this.get('existingFolderSetToUse.id'),
        name: this.get('folderSetName'),
        privacySetting: this.get('folderSetPrivacy')
      };

      this.get('onProceed')(name, owner, mode, folderSetOptions);
    },
    setOwner(val, $item) {
      if (!val) {
        return;
      }
      const isRemoval = _.isNull($item);
      if (isRemoval) {
        this.set('selectedOwner', null);
        return;
      }
      const user = this.get('store').peekRecord('user', val);
      this.set('selectedOwner', user);
    },
    toggleCreateFolderset(val) {
      this.set('doCreateFolderSet', val);
    },
    back() {
      this.get('onBack')(-1);
    }
  }
});