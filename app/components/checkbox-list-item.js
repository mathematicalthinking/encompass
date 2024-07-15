// Import necessary dependencies
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
// Define the component as a native JavaScript class
export default class CheckboxListItem extends Component {
  classNames = ['checkbox-list-item'];

  @tracked('selectedItems.[]', 'item')
  get isSelected() {
    let items = this.selectedItems || [];
    return items.includes(this.item);
  }

  @tracked('item.id')
  get value() {
    return this.item.id;
  }

  @tracked('item', 'displayProp')
  get displayValue() {
    let propName = `item.${this.displayProp}`;
    return propName || this.item;
  }

  @action
  onSelect() {
    this.onSelect(this.item, this.isSelected);
  }
}
