import AuthenticatedRoute from '../_authenticated_route';
import { hash } from 'rsvp';

export default AuthenticatedRoute.extend({
  model: async function (params) {
    let currentUser = this.modelFor('application');
    return hash({
      currentUser,
      assignment: await this.store.findRecord('assignment', params.assignment_id),
    });
  },

  actions: {
    toAnswerInfo: function (answer) {
      this.transitionTo('answer', answer);
    },
    toAssignments: function () {
      this.transitionTo('assignments');
    },
  },

  renderTemplate: function () {
    this.render('assignments/assignment');
  },
});
