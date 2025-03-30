import { hash } from 'rsvp';
import AuthenticatedRoute from '../_authenticated_route';
import { service } from '@ember/service';
export default class AssignmentsNewRoute extends AuthenticatedRoute {
  @service store;
  @service currentUser;
  @service router;
  beforeModel() {
    if (this.currentUser.isStudent) this.router.transitionTo('assignments');
  }
  model() {
    return hash({
      sections: this.store.findAll('section'),
      groups: this.store.findAll('group'),
      cachedProblems: this.store.findAll('problem'),
    });
  }
}
