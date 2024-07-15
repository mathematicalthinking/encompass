// Import necessary dependencies
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// Define the component as a native JavaScript class
export default class CheckboxListComponent extends Component {
  classNames = ['checkbox-list'];

  selectedItems = [];
  isToggledAll = false;

  @tracked('isToggledAll')
  get selectAllLabel() {
    return this.isToggledAll ? 'Deselect All' : 'Select All';
  }
  constructor() {
    super(...arguments);

    let initialSelectedItems = this.initialSelectedItems;
    if (initialSelectedItems) {
      this.selectedItems = [...initialSelectedItems];
    }
  }
  @action
  onToggleAll() {
    let wasSelected = this.isToggledAll;
    if (wasSelected) {
      this.selectedItems = [];
    } else {
      this.selectedItems = this.items;
    }
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
