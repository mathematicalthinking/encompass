import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
export default class MetricsRoute extends Route {
  @service store;
  async model() {
    const sections = await this.store.findAll('section');
    return hash({
      workspaces: this.store.findAll('workspace'),
      problems: this.store.findAll('problem'),
      sections: sections.toArray(),
    });
  }
}
