import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ExpandableCellComponent extends Component {
  @tracked showThis = false;
  get expanded() {
    return this.args.showAll || this.showThis;
  }
  @action toggleExpand() {
    this.showThis = !this.showThis;
  }
}
