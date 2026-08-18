import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class AuthIndex extends Component {
  @tracked shouldShowLogin = null;

  constructor() {
    super(...arguments);
    this.shouldShowLogin = null;
    this.init();
  }

  @action
  changeComponent() {
    if (this.shouldShowLogin) {
      this.shouldShowLogin = false;
    } else {
      this.shouldShowLogin = true;
    }
  }
}
