import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class NewFoldersetFormComponent extends Component {
  privacyInputs = {
    groupName: 'privacySetting',
    required: true,
    inputs: [
      {
        value: 'M',
        label: 'Private',
        isChecked: true,
        moreInfo: 'Only you will be able to see and reuse this folder set',
      },
      {
        value: 'O',
        label: 'My Org',
        isChecked: false,
        moreInfo:
          'All members of your org will be able to see and reuse this folder set',
      },
      {
        value: 'E',
        label: 'Public',
        isChecked: false,
        moreInfo:
          'All Encompass users will be able to see and reuse this folder set',
      },
    ],
  };

  // the parent owns the value; default the displayed selection to Private ('M')
  get privacySetting() {
    return this.args.privacySetting ?? 'M';
  }

  @action
  updateName(event) {
    this.args.onNameChange(event.target.value);
  }

  @action
  updatePrivacySetting(val) {
    this.args.onPrivacyChange(val);
  }
}
