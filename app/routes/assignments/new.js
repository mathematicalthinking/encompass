import { hash } from 'rsvp';
import { action } from '@ember/object';
import AuthenticatedRoute from '../_authenticated_route';
import { inject as service } from '@ember/service';
export default class AssignmentsNewRoute extends AuthenticatedRoute {
  @service store;
  @service router;
  beforeModel() {
    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');
    if (isStudent) {
      this.router.transitionTo('assignments');
    }
  }
  model() {
    return hash({
      currentUser: this.modelFor('application'),
      sections: this.store.findAll('section'),
      groups: this.store.findAll('group'),
      cachedProblems: this.store.findAll('problem'),
    });
  }
  @action toAssignmentInfo(model) {
    this.router.transitionTo('assignment', model);
  }
  @action toAssignmentsHome() {
    this.router.transitionTo('assignments');
  }
}
