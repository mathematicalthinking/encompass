import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ImportWorkStep2Component extends Component {
  @service store;
  @service('utility-methods') utils;

  @tracked selectedValue = false;
  @tracked selectedSection = null;
  @tracked missingSection = null;

  useClassOptions = {
    groupName: 'useClass',
    required: true,
    inputs: [
      {
        value: true,
        label: 'Yes',
      },
      {
        value: false,
        label: 'No',
      },
    ],
  };

  constructor(owner, args) {
    super(owner, args);
    this.selectedValue = args.selectedValue === true;
    this.selectedSection = args.selectedSection || null;
  }

  get selectingClass() {
    return this.selectedValue === true;
  }

  get initialSectionItem() {
    if (this.utils.isNonEmptyObject(this.selectedSection)) {
      return [this.selectedSection.id];
    }
    return [];
  }

  notifySelectionChanged() {
    if (typeof this.args.onSelectionChange === 'function') {
      this.args.onSelectionChange({
        selectedValue: this.selectedValue,
        selectedSection: this.selectedSection,
      });
    }
  }

  @action
  updateSelectedValue(val) {
    this.selectedValue = val === true;
    if (!this.selectedValue) {
      this.selectedSection = null;
      this.missingSection = null;
    }
    this.notifySelectionChanged();
  }

  @action
  setSelectedSection(val, item) {
    if (!val) {
      return;
    }

    const isRemoval = this.utils.isNullOrUndefined(item);
    if (isRemoval) {
      this.selectedSection = null;
      this.notifySelectionChanged();
      return;
    }

    const section = this.store.peekRecord('section', val);
    if (this.utils.isNullOrUndefined(section)) {
      return;
    }

    this.selectedSection = section;
    if (this.missingSection) {
      this.missingSection = null;
    }
    this.notifySelectionChanged();
  }

  @action
  resetMissingSection() {
    this.missingSection = null;
  }

  @action
  next() {
    if (!this.selectedValue) {
      this.selectedSection = null;
      this.missingSection = null;
      this.notifySelectionChanged();
      if (typeof this.args.onProceed === 'function') {
        this.args.onProceed({
          selectedValue: this.selectedValue,
          selectedSection: this.selectedSection,
        });
      }
      return;
    }

    if (this.utils.isNonEmptyObject(this.selectedSection)) {
      this.notifySelectionChanged();
      if (typeof this.args.onProceed === 'function') {
        this.args.onProceed({
          selectedValue: this.selectedValue,
          selectedSection: this.selectedSection,
        });
      }
      return;
    }

    this.missingSection = true;
  }

  @action
  back() {
    this.notifySelectionChanged();
    if (typeof this.args.onBack === 'function') {
      this.args.onBack(-1);
    }
  }
}
