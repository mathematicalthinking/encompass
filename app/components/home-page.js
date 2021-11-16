import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HomePageComponent extends Component {
  @tracked isExpanded = true;
  constructor() {
    super(...arguments);
    if (this.args.item.details.length === 0) {
      this.isExpanded = false;
    }
  }
  @action updateIsExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
