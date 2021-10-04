import Component from '@glimmer/component';
import { action } from '@ember/object';
import _ from 'underscore';

export default class RadioGroupItem extends Component {
  get isSelected() {
    return _.isEqual(this.args.selectedValue, this.args.value);
  }
  @action onClick(val) {
    this.args.onClick(val);
  }
}
