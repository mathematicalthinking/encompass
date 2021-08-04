import AuthenticatedRoute from './_authenticated_route';
import { inject as service } from '@ember/service';
/**
 * # Answers Route
 * @description Route for dealing with all answer objects
 */
export default class AnswersRoute extends AuthenticatedRoute {
  @service store;
  model() {
    let answers = this.store.findAll('answer');
    return answers;
  }

  renderTemplate() {
    this.render('answers/answers');
  }
}
