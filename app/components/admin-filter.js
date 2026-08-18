import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

/**
<AdminFilter
    @filterName={{string}}
    @onUpdate={{function}}
/>


Admin filter expects the subOptions to be an object with the following structure:
{
    val1: {type: 'list', inputId, maxItems, ...},
    val2: {type: 'checkbox', options: [{value, icon, label}, {value, icon, label, etc...]}
 */

export default class AdminFilterComponent extends Component {
  @service('utility-methods') utils;
  @service inputState;
  @tracked dropdownSelections = [];

  get initialMainSelection() {
    return [this.mainOptions?.[0]?.value ?? null];
  }

  get hasCurrentSelections() {
    return this.dropdownSelections.length > 0;
  }

  get mainOptions() {
    return this.inputState.getOptions(this.args.filterName);
  }

  get mainSelection() {
    return this.inputState.getSelection(this.args.filterName);
  }

  get subOptions() {
    return this.inputState.getSubOptions(this.args.filterName);
  }

  get subSelections() {
    return this.inputState.getSubSelections(this.args.filterName);
  }

  @action
  handleUpdateMain(val) {
    this.inputState.setSelection(this.args.filterName, val);
    this.dropdownSelections = [];
    if (this.args.onUpdate) {
      this.args.onUpdate();
    }
  }

  @action
  updateMultiSelect(val, $item) {
    if (!val) return;

    const isRemoval = !$item;

    if (isRemoval) {
      this.dropdownSelections = this.dropdownSelections.filter(
        (item) => item !== val
      );
    } else {
      this.dropdownSelections = [...this.dropdownSelections, val];
    }
    this.inputState.setListState(this.args.filterName, this.dropdownSelections);
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
