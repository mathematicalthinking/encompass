import Component from '@glimmer/component';
import { action } from '@ember/object';
import _ from 'underscore';

export default class RadioFilterComponent extends Component {
  get isSelected() {
    let groupValue = this.args.groupValue;
    let ownValue = this.args.inputValue;
    return _.isEqual(groupValue, ownValue);
  }
  @action onClick(val) {
    this.args.onClick(val);
  }
}
