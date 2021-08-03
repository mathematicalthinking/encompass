import { inject as controller } from '@ember/controller';
import { hash } from 'rsvp';
import AuthenticatedRoute from './_authenticated_route';

export default AuthenticatedRoute.extend({
  hideOutlet: true,
  // application: controller(),

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
  model: function () {
    const store = this.store;
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
      organizations: store.findAll('organization'),
      sections: store.findAll('section'),
      problems: store.query('problem', problemCriteria),
      hideOutlet: this.hideOutlet,
      currentUser: user,
    });
  },

  renderTemplate: function () {
    this.render('problems/problems');
  },
  actions: {
    toProblemInfo(problem) {
      this.transitionTo('problem', problem);
    },
    sendtoApplication(categories) {
      this.application.set('categories', categories);
      this.application.set('showCategoryList', true);
    },
  },
});
