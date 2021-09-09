import AuthenticatedRoute from '../_authenticated_route';
import { hash } from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SectionsSectionRoute extends AuthenticatedRoute {
  @service store;
  async model(params) {
    let section = await this.store.findRecord('section', params.section_id);
    let groups = await this.store.query('group', {
      section: params.section_id,
    });
    const users = await this.store.findAll('user');
    const currentUser = await this.modelFor('application');
    return hash({
      section,
      currentUser,
      groups,
      users,
    });
  }

  @action toSectionList() {
    this.transitionTo('sections');
  }
  @action toAssignmentInfo(assignment) {
    this.transitionTo('assignments.assignment', assignment);
  }
  @action refreshModel() {
    this.refresh();
  }
}
