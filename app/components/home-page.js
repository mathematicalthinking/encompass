import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HomePageComponent extends Component {
  @tracked isExpanded = true;
  @action updateIsExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
