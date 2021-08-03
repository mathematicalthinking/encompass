/*global _:false */
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['radio-group-item'],

  isSelected: computed('selectedValue', 'value', function () {
    const selectedValue = this.selectedValue;
    const value = this.value;

    return _.isEqual(selectedValue, value);
  }),

  actions: {
    onClick(val) {
      this.onClick(val);
    },
  },
});
