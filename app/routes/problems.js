import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { hash } from 'rsvp';
import AuthenticatedRoute from './_authenticated_route';
import { use } from 'chai';

export default class ProblemsRoute extends AuthenticatedRoute {
  @service store;
  hideOutlet = true;

  // beforeModel: function (transition) {
  //   this._super.apply(this, arguments);

  //   let problemId;
  //   let params = transition.params;
  //   if (params.problem) {
  //     problemId = params.problem.problemId;
  //   }
  //   if (problemId) {
  //     this.set('hideOutlet', false);
  //   } else {
  //     if (!this.hideOutlet) {
  //       this.set('hideOutlet', true);
  //     }
  //   }
  // },
  async model() {
    const user = this.modelFor('application');
    const userOrg = await user.get('organization');
    const recommendedProblems = await userOrg.get('recommendedProblems');
    let problemCriteria = {};

    if (!user.get('isAdmin')) {
      problemCriteria = {
        filterBy: {
          createdBy: user.id,
        },
      };
    }
    return hash({
      organizations: this.store.findAll('organization'),
      sections: this.store.findAll('section'),
      problems: this.store.query('problem', problemCriteria),
      hideOutlet: this.hideOutlet,
      currentUser: user,
      recommendedProblems,
    });
  }
}
