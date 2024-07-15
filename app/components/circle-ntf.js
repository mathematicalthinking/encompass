// Import necessary dependencies
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

// Define the component as a native JavaScript class
export default class CircleNotificationComponent extends Component {
  classNames = ['circle-ntf'];

  @tracked('displayCount')
  get count() {
    let count = this.displayCount;

    if (typeof count !== 'number') {
      return 0;
    }
    if (count > 99) {
      return '99+';
    }
    return count;
  }

  @tracked('count', 0) areNoNtfs;
}
