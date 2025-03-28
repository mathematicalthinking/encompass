// app/routes/problems/problem.js
import AuthenticatedRoute from '../_authenticated_route';
import { service } from '@ember/service';

export default class ProblemsProblemRoute extends AuthenticatedRoute {
  @service store;
  @service problemUtils;

  async model(params) {
    return this.problemUtils.fetchProblemData(params.problem_id);
  }
}
