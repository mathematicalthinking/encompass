import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ProblemsProblemAssignmentController extends Controller {
  @service router;

  @action
  handleHideAssignment() {
    this.router.transitionTo('problems.problem', this.model.problem.id);
  }
}
