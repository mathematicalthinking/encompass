import { hash } from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from '../_authenticated_route';

export default class ProblemsNewRoute extends AuthenticatedRoute {
  @service store;
  @service router;
  model() {
    let currentUser = this.modelFor('application');
    return hash({
      currentUser,
      problems: this.store.findAll('problem'),
      organizations: this.store.findAll('organization'),
    });
  }

  @action toProblemInfo(problem) {
    this.router.transitionTo('problems.problem', problem.id);
  }
  @action toProblemList() {
    this.router.transitionTo('problems');
  }
}
