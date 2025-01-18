// app/routes/problems/problem.js
import AuthenticatedRoute from '../_authenticated_route';
import { service } from '@ember/service';
import fetchProblemData from 'encompass/utils/fetch-problem-data';

export default class ProblemsProblemRoute extends AuthenticatedRoute {
  @service store;

  async model(params) {
    let currentUser = this.modelFor('application');
    return fetchProblemData(this.store, params.problem_id, currentUser);
  }
}
