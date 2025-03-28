import { hash } from 'rsvp';
import { service } from '@ember/service';
import AuthenticatedRoute from '../_authenticated_route';

export default class ProblemsNewRoute extends AuthenticatedRoute {
  @service store;
  model() {
    return hash({
      problems: this.store.findAll('problem'),
      organizations: this.store.findAll('organization'),
    });
  }
}
