/*global _:false */
import Component from '@ember/component';
import { computed } from '@ember/object';

export default class ToggleControlComponent extends Component {
  tagName = '';
  classNames = [];
  currentValue = null;

  iconClass = computed(
    'currentState',
    'currentValue.icon',
    'isActive',
    'options',
    function () {
      let isActive = this.isActive;
      let options = this.options;
      if (!isActive) {
        return options && options[0] && options[0].icon;
      }
      return this.currentValue.icon;
    }
  );

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    if (this.classToAdd) {
      this.classNames = [this.classToAdd];
    }
    let activeType = this.activeType;
    let isActive = activeType === this.type;
    this.isActive = isActive;

    if (
      !_.isUndefined(this.initialState) &&
      _.isUndefined(this.currentToggleState)
    ) {
      let options = this.options;
      this.currentToggleState = this.initialState;
      this.currentValue = options && options[this.initialState];
    }
  }

  actions = {
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
      this.currentValue = newVal;
      this.currentToggleState = newState;

      if (this.onUpdate) {
        this.onUpdate(newVal);
      }
    },
  };
}
