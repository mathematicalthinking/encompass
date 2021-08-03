/*global _:false */
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: [],
  currentValue: null,

  iconClass: computed('isActive', 'currentValue', 'currentState', function () {
    let isActive = this.isActive;
    let options = this.options;
    if (!isActive) {
      return options[0].icon;
    }
    return this.get('currentValue.icon');
  }),

  didReceiveAttrs() {
    if (this.classToAdd) {
      this.set('classNames', [this.classToAdd]);
    }
    let activeType = this.activeType;
    let isActive = activeType === this.type;
    this.set('isActive', isActive);

    if (
      !_.isUndefined(this.initialState) &&
      _.isUndefined(this.currentToggleState)
    ) {
      let options = this.options;
      this.set('currentToggleState', this.initialState);
      this.set('currentValue', options[this.initialState]);
    }

    this._super(...arguments);
  },

  actions: {
    onToggle() {
      let currentState = this.currentToggleState;
      let newState;
      let newVal;
      let options = this.options;

      if (currentState === 0) {
        newState = 1;
      } else if (currentState === 1) {
        newState = 2;
      } else if (currentState === 2) {
        newState = 1;
      }

      newVal = options[newState];
      this.set('currentValue', newVal);
      this.set('currentToggleState', newState);

      if (this.onUpdate) {
        this.onUpdate(newVal);
      }
    },
  },
});
