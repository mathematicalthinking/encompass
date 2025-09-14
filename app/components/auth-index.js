import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class AuthIndex extends Component {
  @tracked shouldShowLogin = true;

  get buttonText() {
    return this.shouldShowLogin ? 'Log in' : 'Sign up';
  }
  
  @action
  toggleLogin() {
    this.shouldShowLogin = !this.shouldShowLogin;
  }
}
