import AuthenticatedRoute from '../_authenticated_route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default class ProblemsProblemRoute extends AuthenticatedRoute {
  @service store;
  async model(params) {
    const currentUser = this.modelFor('application');
    const userOrg = await currentUser.get('organization');
    const recommendedProblems = await userOrg.get('recommendedProblems');
    const problem = await this.store.findRecord('problem', params.problem_id);
    const sectionList = await this.store.findAll('section');
    const orgList = await this.store.findAll('organization');
    let flaggedBy;
    let flaggedDate;
    if (problem.flagReason?.flaggedBy) {
      flaggedBy = await this.store.findRecord(
        'user',
        problem.flagReason.flaggedBy
      );
    }
    if (problem.flagReason?.flaggedBy) {
      flaggedDate = new Date(problem.flagReason.flaggedDate);
    }
    return hash({
      currentUser,
      problem,
      sectionList,
      orgList,
      recommendedProblems,
      flaggedBy,
      flaggedDate,
    });
  }
}
