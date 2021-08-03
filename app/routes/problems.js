import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { hash } from 'rsvp';
import AuthenticatedRoute from './_authenticated_route';

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
  model() {
    const user = this.modelFor('application');
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
    });
  }

  @action toProblemInfo(problem) {
    this.transitionTo('problems.problem', problem.id);
  }
}
