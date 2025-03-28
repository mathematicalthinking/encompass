// Import necessary dependencies
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// Define the component as a native JavaScript class
export default class CheckboxListComponent extends Component {
  @tracked selectedItems = [];
  @tracked isToggledAll = false;

  get selectAllLabel() {
    return this.isToggledAll ? 'Deselect All' : 'Select All';
  }
  constructor() {
    super(...arguments);

    if (this.args.initialSelectedItems) {
      this.selectedItems = [...this.args.initialSelectedItems];
    }
  }
  @action
  onToggleAll() {
    let wasSelected = this.isToggledAll;
    if (wasSelected) {
      this.selectedItems = [];
    } else {
      this.selectedItems = this.args.items;
    }
    this.isToggledAll = !wasSelected;
  }

  @action
  onItemSelect(item, wasSelected) {
    if (!item) {
      return;
    }
    let selectedItems = this.selectedItems;
    if (wasSelected) {
      selectedItems.removeObject(item);
    } else {
      selectedItems.addObject(item);
    }
  }
}
