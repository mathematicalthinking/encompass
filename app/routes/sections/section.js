import AuthenticatedRoute from '../_authenticated_route';
import { hash } from 'rsvp';
import { service } from '@ember/service';

export default class SectionsSectionRoute extends AuthenticatedRoute {
  @service store;
  async model(params) {
    return hash({
      groups: this.store.query('group', {
        section: params.section_id,
      }),
      section: this.store.findRecord('section', params.section_id),
      cachedProblems: this.store.findAll('problem'),
    });
  }
}
