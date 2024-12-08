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
  async model() {
    let currentUser = this.modelFor('application');
    return hash({
      currentUser,
      sections: await this.store.findAll('section'),
      groups: await this.store.findAll('group'),
      cachedProblems: await this.store.findAll('problem'),
    });
  }
  @action toAssignmentInfo(model) {
    this.router.transitionTo('assignment', model);
  }
  @action toAssignmentsHome() {
    this.router.transitionTo('assignments');
  }
}
