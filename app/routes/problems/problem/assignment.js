import AuthenticatedRoute from 'encompass/routes/_authenticated_route';

export default class ProblemsProblemAssignmentRoute extends AuthenticatedRoute {
  model() {
    // This reuses the model already loaded by problems/problem.js (must be a parent route)
    return this.modelFor('problems.problem');
  }
}
