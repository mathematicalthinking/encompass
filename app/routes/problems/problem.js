import AuthenticatedRoute from '../_authenticated_route';
import { hash } from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProblemsProblemRoute extends AuthenticatedRoute {
  @service store;
  model(params) {
    const currentUser = this.modelFor('application');
    var problem = this.store.findRecord('problem', params.problem_id);
    return hash({ currentUser, problem });
  }

  @action toProblemList() {
    this.transitionTo('problems');
  }
  @action toAssignmentInfo(assignment) {
    this.transitionTo('assignment', assignment);
  }
}
