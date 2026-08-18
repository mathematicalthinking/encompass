import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class ProblemsRoute extends Route {
  @service store;
  @service currentUser;

  async model() {
    let problemCriteria = {};

    if (!this.currentUser.isAdmin) {
      problemCriteria = {
        filter: {
          createdBy: this.currentUser.id,
        },
      };
    }

    return hash({
      organizations: this.store.findAll('organization'),
      problems: this.store.query('problem', problemCriteria),
    });
  }
}
