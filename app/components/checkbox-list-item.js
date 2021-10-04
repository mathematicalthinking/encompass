import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['checkbox-list-item'],

  isSelected: computed('selectedItems.[]', 'item', function () {
    let items = this.selectedItems || [];
    return items.includes(this.item);
  }),

  value: computed('item.id', function () {
    return this.get('item.id');
  }),

  displayValue: computed('item', 'displayProp', function () {
    let propName = `item.${this.displayProp}`;
    return this.get(propName);
  }),

  actions: {
    onSelect() {
      this.onSelect(this.item, this.isSelected);
    },
  },
});
