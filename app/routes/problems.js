import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { hash } from 'rsvp';
import AuthenticatedRoute from './_authenticated_route';

export default class ProblemsRoute extends AuthenticatedRoute {
  @service store;
  hideOutlet = true;

  async model() {
    const user = this.modelFor('application');
    // checking to see if organization is being fetched. quick fix to load all problems.
    // const userOrg = await user.get('organization');
    const recommendedProblems = await user.get('recommendedProblems');
    let problemCriteria = {};

    if (!user.get('isAdmin')) {
      problemCriteria = {
        filterBy: {
          createdBy: user.id,
        },
      };
    }
    return hash({
      // organizations: this.store.findAll('organization'),
      sections: this.store.findAll('section'),
      problems: this.store.query('problem', problemCriteria),
      hideOutlet: this.hideOutlet,
      currentUser: user,
      recommendedProblems,
    });
  }
}
