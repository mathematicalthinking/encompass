import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CollapsibleListComponent extends Component {
  @tracked isOpen = true;
  @action toggleIsOpen() {
    this.isOpen = !this.isOpen;
  }
}
