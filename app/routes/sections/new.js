import { hash } from 'rsvp';
import AuthenticatedRoute from '../_authenticated_route';

export default AuthenticatedRoute.extend({
  beforeModel: function () {
    this._super.apply(this, arguments);

    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.transitionTo('sections');
    }
  },

  model: async function (params) {
    return hash({
      users: await this.store.findAll('user'),
      organizations: await this.store.findAll('organization'),
      user: await this.modelFor('application'),
      sections: await this.store.findAll('section'),
    });
  },
  renderTemplate: function () {
    this.render('sections/new');
  },
  actions: {
    toSectionInfo: function (section) {
      this.transitionTo('sections.section', section.id);
    },
    toSectionsHome: function () {
      this.transitionTo('sections');
    },
  },
});
