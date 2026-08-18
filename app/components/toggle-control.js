import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ToggleControlComponent extends Component {
  @tracked classNames = [];
  @tracked currentValue = null;
  @tracked currentToggleState;

  constructor() {
    super(...arguments);

    if (this.args.classToAdd) {
      this.classNames = [this.args.classToAdd];
    }

    if (this.args.initialState !== undefined) {
      this.currentToggleState = this.args.initialState;
      this.currentValue = this.args.options?.[this.args.initialState] || null;
    }
  }

  get isActive() {
    return this.args.type === this.args.activeType;
  }

  get iconClass() {
    if (!this.isActive) {
      return this.args.options[0]?.icon || '';
    }
    return this.currentValue?.icon || this.args.options[0]?.icon || '';
  }

  @action
  onToggle() {
    let newState = 1;

    switch (this.currentToggleState) {
      case 0:
        newState = 1;
        break;
      case 1:
        newState = 2;
        break;
      case 2:
        newState = 1;
        break;
    }

    this.currentValue = this.args.options?.[newState] || null;
    this.currentToggleState = newState;

    if (this.args.onUpdate) {
      this.args.onUpdate(this.currentValue);
    }
  }
}
