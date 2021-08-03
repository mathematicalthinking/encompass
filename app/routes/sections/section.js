import AuthenticatedRoute from '../_authenticated_route';
import { hash } from 'rsvp';

export default AuthenticatedRoute.extend({
  async model(params) {
    let section = await this.store.findRecord('section', params.section_id);
    const currentUser = await this.modelFor('application');
    return hash({
      section,
      currentUser,
    });
  },

  actions: {
    toSectionList: function () {
      this.transitionTo('sections');
    },
    toAssignmentInfo: function (assignment) {
      this.transitionTo('assignments.assignment', assignment);
    },
  },
});
