import AuthenticatedRoute from './_authenticated_route';
import RSVP from 'rsvp';

export default AuthenticatedRoute.extend({
  model: async function () {
    let sections = await this.store.findAll('section');
    let currentUser = this.modelFor('application');
    return RSVP.hash({ sections, currentUser });
  },
});
