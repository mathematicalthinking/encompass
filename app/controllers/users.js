import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class UsersController extends Controller {
  @service currentUser;

  // true when user should NOT see the list
  get isForbidden() {
    return this.currentUser.isStudent;
  }
}
