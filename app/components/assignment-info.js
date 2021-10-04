import ErrorHandlingComponent from './error-handling';
import { inject as service } from '@ember/service';

export default class AssignmentInfoComponent extends ErrorHandlingComponent {
  @service('utility-methods') utils;

  get currentProblem() {
    let assignment = this.args.assignment;
    if (!assignment) {
      return null;
    }
    return assignment.get('problem.content');
  }

  get currentSection() {
    let assignment = this.args.assignment;
    if (!assignment) {
      return null;
    }
    return assignment.get('section.content');
  }
}
