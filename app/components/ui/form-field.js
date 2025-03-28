import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class UiFormFieldComponent extends Component {
  @tracked currentValue = this.args.value;

  get id() {
    return this.args.id || this.args.name || 'xyzzy';
  }

  @action
  handleInput(event) {
    this.currentValue = event.target.value;
    if (this.args.onChange) {
      this.args.onChange(this.currentValue);
    }
  }

  @action
  handleCheckboxChange(event) {
    const isChecked = event.target.checked;
    if (this.args.onChange) {
      this.args.onChange(isChecked);
    }
  }

  @action
  handleButtonClick() {
    if (this.args.onClick) {
      this.args.onClick();
    }
  }

  @action
  resetEditingValue() {
    this.currentValue = this.args.value;
  }
}
