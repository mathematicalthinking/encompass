import { hash } from 'rsvp';
import { action } from '@ember/object';
import AuthenticatedRoute from '../_authenticated_route';

export default class AssignmentsNewRoute extends AuthenticatedRoute {
  beforeModel() {
    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.transitionTo('assignments');
    }
  }
  model() {
    let currentUser = this.modelFor('application');
    return hash({
      currentUser,
      sections: this.store.findAll('section'),
      groups: this.store.findAll('group'),
    });
  }
  @action toAssignmentInfo(model) {
    this.transitionTo('assignment', model);
  }
  @action toAssignmentsHome() {
    this.transitionTo('assignments');
  }
}
