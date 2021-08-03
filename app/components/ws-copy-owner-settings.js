import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  elementId: 'ws-copy-owner-settings',
  utils: service('utility-methods'),
  strSimilarity: service('string-similarity'),

  constraints: computed('validModeValues', 'doCreateFolderSet', function () {
    let res = {
      name: {
        presence: { allowEmpty: false },
        length: { maximum: 500 },
      },

      owner: {
        presence: { allowEmpty: false },
      },

      mode: {
        inclusion: {
          within: this.validModeValues,
          message: 'Please select a valid mode.',
        },
      },
      doCreateFolderSet: {
        inclusion: {
          within: [true, false],
          message: '',
        },
      },
    };

    if (!this.doCreateFolderSet) {
      return res;
    }

    res.folderSetName = {
      presence: { allowEmpty: false },
      length: { maximum: 500 },
    };

    res.folderSetPrivacySetting = {
      inclusion: {
        within: ['M', 'O', 'E'],
      },
    };
    return res;
  }),

  validModeValues: computed('modeInputs', function () {
    const modeInputs = this.get('modeInputs.inputs');

    if (this.utils.isNonEmptyArray(modeInputs)) {
      return modeInputs.map((input) => input.value);
    }
    return [];
  }),

  didReceiveAttrs() {
    const newWsOwner = this.newWsOwner;
    const newWsName = this.newWsName;
    const newWsMode = this.newWsMode;
    const newFolderSetOptions = this.newFolderSetOptions;
    const utils = this.utils;

    if (utils.isNonEmptyObject(newWsOwner)) {
      this.set('selectedOwner', newWsOwner);
    } else if (!utils.isNonEmptyObject(this.selectedOwner)) {
      this.set('selectedOwner', this.currentUser);
    }

    if (utils.isNonEmptyString(newWsName)) {
      this.set('selectedName', newWsName);
    } else if (!utils.isNonEmptyString(this.selectedName)) {
      this.set('selectedName', `Copy of ${this.get('workspace.name')}`);
    }

    if (utils.isNonEmptyString(newWsMode)) {
      this.set('selectedMode', newWsMode);
    } else if (!utils.isNonEmptyString(this.selectedMode)) {
      this.set('selectedMode', 'private');
    }

    if (utils.isNonEmptyObject(newFolderSetOptions)) {
      this.set('doCreateFolderSet', newFolderSetOptions.doCreateFolderSet);
      this.set('folderSetName', newFolderSetOptions.name);
      this.set('folderSetPrivacy', newFolderSetOptions.privacySetting);
      this.set('existingFolderSetToUse', this.existingFolderSet);
    } else if (utils.isNullOrUndefined(this.doCreateFolderSet)) {
      this.set('doCreateFolderSet', false);
    }

    this._super(...arguments);
  },

  initialOwnerItem: computed('selectedOwner', function () {
    const selectedOwner = this.selectedOwner;
    if (this.utils.isNonEmptyObject(selectedOwner)) {
      return [selectedOwner.id];
    }
    return [];
  }),

  initialOwnerOptions: computed('selectedOwner', function () {
    const selectedOwner = this.selectedOwner;

    if (this.utils.isNonEmptyObject(selectedOwner)) {
      return [
        {
          id: selectedOwner.id,
          username: selectedOwner.get('username'),
        },
      ];
    }
    return [];
  }),
  initialFolderSetItem: computed('existingFolderSet', function () {
    const existingFolderSet = this.existingFolderSet;
    if (this.utils.isNonEmptyObject(existingFolderSet)) {
      return [existingFolderSet.get('id')];
    }
    return [];
  }),

  initialFolderSetOptions: computed('folderSets.[]', function () {
    const folderSets = this.folderSets;
    if (folderSets) {
      return folderSets.map((folderSet) => {
        return {
          id: folderSet.get('id'),
          name: folderSet.get('name'),
        };
      });
    }
    return [];
  }),

  isPublicFolderSetNameTaken: function (name) {
    let folderSets = this.folderSets;
    if (!folderSets || typeof name !== 'string') {
      return false;
    }
    if (folderSets) {
      let existingFs = folderSets.find((fs) => {
        return (
          !fs.get('isTrashed') &&
          fs.get('privacySetting') === 'E' &&
          this.strSimilarity.compareTwoStrings(name, fs.get('name')) === 1
        );
      });
      return existingFs !== undefined;
    }
    return false;
  },

  actions: {
    next() {
      const name = this.selectedName;
      const owner = this.selectedOwner;
      const mode = this.selectedMode;
      const folderSetName = this.folderSetName;
      const folderSetPrivacySetting = this.folderSetPrivacy;

      if (
        folderSetPrivacySetting === 'E' &&
        this.isPublicFolderSetNameTaken(folderSetName)
      ) {
        this.set('duplicateFolderSetName', true);
        return;
      }
      const doCreateFolderSet = this.doCreateFolderSet;

      // clear old values if the 'No' radio button is selected and next is hit
      let errors;

      if (!doCreateFolderSet) {
        this.set('folderSetName', null);
        this.set('folderSetPrivacy', null);
        errors = window.validate(
          { name, owner, mode, doCreateFolderSet },
          this.constraints
        );
      } else {
        errors = window.validate(
          {
            name,
            owner,
            mode,
            doCreateFolderSet,
            folderSetName,
            folderSetPrivacySetting,
          },
          this.constraints
        );
      }

      if (this.utils.isNonEmptyObject(errors)) {
        for (let key of Object.keys(errors)) {
          let errorProp = `${key}Errors`;
          this.set(errorProp, errors[key]);
        }
        return;
      }

      const folderSetOptions = {
        doCreateFolderSet: doCreateFolderSet,
        existingFolderSetToUse: this.get('existingFolderSetToUse.id'),
        name: folderSetName,
        privacySetting: folderSetPrivacySetting,
      };

      this.onProceed(name, owner, mode, folderSetOptions);
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
      const user = this.store.peekRecord('user', val);
      this.set('selectedOwner', user);
    },
    setFolderSet(val, $item) {
      if (!val) {
        return;
      }
      const isRemoval = _.isNull($item);
      if (isRemoval) {
        this.set('existingFolderSetToUse', null);
        return;
      }
      const folderSet = this.store.peekRecord('folder-set', val);
      this.set('existingFolderSetToUse', folderSet);
    },

    toggleCreateFolderset(val) {
      this.set('doCreateFolderSet', val);
    },
    back() {
      this.onBack(-1);
    },
  },
});
