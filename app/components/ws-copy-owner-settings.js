import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import isNull from 'lodash-es/isNull';
import validate from 'validate.js';

export default class WsCopyOwnerSettingsComponent extends Component {
  @service('utility-methods') utils;
  @service('string-similarity') strSimilarity;
  @service store;
  @service currentUser;

  @tracked selectedOwner;
  @tracked selectedName;
  @tracked selectedMode;
  @tracked doCreateFolderSet = false;
  @tracked folderSetName;
  @tracked folderSetPrivacy;
  @tracked existingFolderSetToUse;

  // validation error arrays, populated in next()
  @tracked nameErrors;
  @tracked ownerErrors;
  @tracked modeErrors;
  @tracked folderSetNameErrors;
  @tracked folderSetPrivacySettingErrors;
  @tracked duplicateFolderSetName = false;

  constructor() {
    super(...arguments);
    // this step is re-rendered fresh on each entry, so seeding here is enough.
    const { newWsOwner, newWsName, newWsMode, newFolderSetOptions } = this.args;
    const utils = this.utils;

    this.selectedOwner = utils.isNonEmptyObject(newWsOwner)
      ? newWsOwner
      : this.currentUser.user;

    this.selectedName = utils.isNonEmptyString(newWsName)
      ? newWsName
      : `Copy of ${this.args.workspace?.get('name')}`;

    this.selectedMode = utils.isNonEmptyString(newWsMode)
      ? newWsMode
      : 'private';

    if (utils.isNonEmptyObject(newFolderSetOptions)) {
      this.doCreateFolderSet = newFolderSetOptions.doCreateFolderSet;
      this.folderSetName = newFolderSetOptions.name;
      this.folderSetPrivacy = newFolderSetOptions.privacySetting;
      this.existingFolderSetToUse = this.args.existingFolderSet;
    }
  }

  get constraints() {
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
  }

  get validModeValues() {
    const modeInputs = this.args.modeInputs?.inputs;
    if (this.utils.isNonEmptyArray(modeInputs)) {
      return modeInputs.map((input) => input.value);
    }
    return [];
  }

  get initialOwnerItem() {
    const selectedOwner = this.selectedOwner;
    if (this.utils.isNonEmptyObject(selectedOwner)) {
      return [selectedOwner.id];
    }
    return [];
  }

  get initialOwnerOptions() {
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
  }

  get initialFolderSetItem() {
    const existingFolderSet = this.args.existingFolderSet;
    if (this.utils.isNonEmptyObject(existingFolderSet)) {
      return [existingFolderSet.get('id')];
    }
    return [];
  }

  get initialFolderSetOptions() {
    const folderSets = this.args.folderSets;
    if (folderSets) {
      return folderSets.map((folderSet) => ({
        id: folderSet.get('id'),
        name: folderSet.get('name'),
      }));
    }
    return [];
  }

  isPublicFolderSetNameTaken(name) {
    let folderSets = this.args.folderSets;
    if (!folderSets || typeof name !== 'string') {
      return false;
    }
    let existingFs = folderSets.find((fs) => {
      return (
        !fs.get('isTrashed') &&
        fs.get('privacySetting') === 'E' &&
        this.strSimilarity.compareTwoStrings(name, fs.get('name')) === 1
      );
    });
    return existingFs !== undefined;
  }

  @action
  updateName(event) {
    this.selectedName = event.target.value;
  }

  @action
  updateSelectedMode(val) {
    this.selectedMode = val;
  }

  @action
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
      this.duplicateFolderSetName = true;
      return;
    }
    const doCreateFolderSet = this.doCreateFolderSet;

    // clear old values if the 'No' radio button is selected and next is hit
    let errors;

    if (!doCreateFolderSet) {
      this.folderSetName = null;
      this.folderSetPrivacy = null;
      errors = validate(
        { name, owner, mode, doCreateFolderSet },
        this.constraints
      );
    } else {
      errors = validate(
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
      this.nameErrors = errors.name;
      this.ownerErrors = errors.owner;
      this.modeErrors = errors.mode;
      this.folderSetNameErrors = errors.folderSetName;
      this.folderSetPrivacySettingErrors = errors.folderSetPrivacySetting;
      return;
    }

    const folderSetOptions = {
      doCreateFolderSet: doCreateFolderSet,
      existingFolderSetToUse: this.existingFolderSetToUse?.get('id'),
      name: folderSetName,
      // default privacy to Private ('M'), matching the form's default selection
      privacySetting: folderSetPrivacySetting || 'M',
    };

    this.args.onProceed(name, owner, mode, folderSetOptions);
  }

  @action
  setOwner(val, item) {
    if (!val) {
      return;
    }
    if (isNull(item)) {
      this.selectedOwner = null;
      return;
    }
    this.selectedOwner = this.store.peekRecord('user', val);
  }

  @action
  setFolderSet(val, item) {
    if (!val) {
      return;
    }
    if (isNull(item)) {
      this.existingFolderSetToUse = null;
      return;
    }
    this.existingFolderSetToUse = this.store.peekRecord('folder-set', val);
  }

  @action
  toggleCreateFolderset(val) {
    this.doCreateFolderSet = val;
  }

  @action
  updateFolderSetName(value) {
    this.folderSetName = value;
  }

  @action
  updateFolderSetPrivacy(value) {
    this.folderSetPrivacy = value;
  }

  @action
  back() {
    this.args.onBack(-1);
  }

  @action
  resetNameErrors() {
    this.nameErrors = null;
  }

  @action
  resetOwnerErrors() {
    this.ownerErrors = null;
  }

  @action
  resetModeErrors() {
    this.modeErrors = null;
  }

  @action
  resetDuplicateFolderSetName() {
    this.duplicateFolderSetName = false;
  }
}
