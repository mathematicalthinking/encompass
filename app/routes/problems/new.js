import { hash } from 'rsvp';
import { service } from '@ember/service';
import AuthenticatedRoute from '../_authenticated_route';

export default class ProblemsNewRoute extends AuthenticatedRoute {
  @service store;
  @service currentUser;
  @service navigation;
  beforeModel() {
    if (this.currentUser.isStudent) {
      // Students can't create problems; redirect before model() runs.
      return this.navigation.toHome();
    }
  }
  model() {
    return hash({
      problems: this.store.findAll('problem'),
      organizations: this.store.findAll('organization'),
    });
  }
}
