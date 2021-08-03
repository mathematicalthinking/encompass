import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['checkbox-list'],

  selectedItems: [],
  isToggledAll: false,

  selectAllLabel: computed('isToggledAll', function () {
    let isOn = this.isToggledAll;
    return isOn ? 'Deselect All' : 'Select All';
  }),

  didReceiveAttrs() {
    let initialSelectedItems = this.initialSelectedItems;
    if (initialSelectedItems) {
      this.selectedItems.addObjects(initialSelectedItems);
    }
  },

  actions: {
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
    },
    onToggleAll() {
      let wasSelected = this.isToggledAll;
      if (wasSelected) {
        this.set('selectedItems', []);
      } else {
        this.set('selectedItems', this.items);
      }
      this.toggleProperty('isToggledAll');
    },
  },
});
