import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class ProblemsRoute extends Route {
  @service store;

  hideOutlet = true;

  async model() {
    const user = this.modelFor('application');
    const userOrg = await user.organization;
    const recommendedProblems = userOrg
      ? await userOrg.recommendedProblems
      : [];
    let problemCriteria = {};

    if (!user.isAdmin) {
      problemCriteria = {
        filter: {
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
