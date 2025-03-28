import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class RadioGroupComponent extends Component {
  @service('utility-methods') utils;
  @action setValue(val) {
    if (this.utils.isNullOrUndefined(val)) {
      return;
    }
    this.args.updateValue(val);
  }
}
