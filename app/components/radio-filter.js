/**
 * RadioFilter
 * Arguments:
 * - @groupValue {String} - The current value of the group
 * - @isChecked {Boolean} - Whether this input is checked
 * - @groupName {String} - The name of the radio group
 * - @inputValue {String} - The value of this radio button
 * - @onClick {Function} - Action to handle click event
 * - @labelName {String} - Label text for the radio button
 * - @labelIcon {String} - Icon class for the label
 */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RadioFilterComponent extends Component {
  @tracked isChecked = this.args.isChecked;

  get isSelected() {
    return this.args.groupValue === this.args.inputValue;
  }

  @action
  onClick(val) {
    console.log('onclick', val, this.args.inputValue);
    if (typeof this.args.onClick === 'function') {
      this.args.onClick(val ?? this.args.inputValue);
    }
  }
}
