/**
 * # HomePageComponent
 * @description This is the dashboard dispaly component. It takes item (obj {label: string, details: obj[] }), tableColumns (array of objects), and showTable (bool) as arguments. It renders either an Ember Table or grid of cards using item.details and tableColumns.
 * @author Tim Leonard <tleonard@21pstem.org>
 * @since 3.2.0
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HomePageComponent extends Component {
  @tracked isExpanded = true;
  constructor() {
    super(...arguments);
    // if (this.args.item.details.length === 0) {
    //   this.isExpanded = false;
    // }
  }
  @action updateIsExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
