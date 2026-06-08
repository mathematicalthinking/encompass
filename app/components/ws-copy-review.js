import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class WsCopyReviewComponent extends Component {
  createDate = Date.now();

  @action
  next() {
    this.args.onProceed();
  }

  @action
  back() {
    this.args.onBack(-1);
  }
}
