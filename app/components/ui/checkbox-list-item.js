import Component from '@glimmer/component';
import { action } from '@ember/object';
export default class CheckboxListItem extends Component {
  get isSelected() {
    let items = this.args.selectedItems || [];
    return items.includes(this.args.item);
  }

  get value() {
    return this.args.item.id;
  }

  get displayValue() {
    if (this.args.displayProp) {
      return this.args.item[this.args.displayProp];
    }
    return this.args.item;
  }

  @action
  onSelect() {
    this.onSelect(this.args.item, this.isSelected);
  }
}
