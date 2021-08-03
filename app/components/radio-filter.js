/*global _:false */
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['radio-filter'],

  didReceiveAttrs() {
    this._super(...arguments);
  },

  isSelected: computed('groupValue', function () {
    let groupValue = this.groupValue;
    let ownValue = this.inputValue;
    return _.isEqual(groupValue, ownValue);
  }),

  actions: {
    onClick(val) {
      this.onClick(val);
    },
  },
});
