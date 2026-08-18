import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class PrimaryListFilterComponent extends Component {
  @service currentUser;
  @service inputState;

  get mainOptions() {
    return this.inputState.getOptions(this.args.filterName);
  }

  get mainSelection() {
    return this.inputState.getSelection(this.args.filterName);
  }

  get mainSelectionValue() {
    return this.inputState.getSelectionValue(this.args.filterName);
  }

  get subOptions() {
    return this.inputState.getSubOptions(this.args.filterName);
  }

  get subSelections() {
    return this.inputState.getSubSelections(this.args.filterName);
  }

  @action
  handleUpdateMain(val) {
    this.inputState.setSelection(this.args.filterName, val.value);
    if (this.args.onUpdate) {
      this.args.onUpdate();
    }
  }

  @action
  toggleSubOption(option) {
    this.inputState.setSubSelection(
      this.args.filterName,
      option.value,
      !this.subSelections.includes(option.value)
    );
    if (this.args.onUpdate) {
      this.args.onUpdate();
    }
  }
}
