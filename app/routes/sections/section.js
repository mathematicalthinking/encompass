import AuthenticatedRoute from '../_authenticated_route';
import { hash } from 'rsvp';
import { service } from '@ember/service';

export default class SectionsSectionRoute extends AuthenticatedRoute {
  @service store;
  @service router;
  async model(params) {
    const section = await this.store.findRecord('section', params.section_id);
    return hash({
      section,
      groups: this.store
        .query('group', {
          section: params.section_id,
        })
        .slice(),
      students: section.students?.slice() ?? [],
      cachedProblems: this.store.findAll('problem').slice(),
    });
  }
}
