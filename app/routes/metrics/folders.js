import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class MetricsFoldersRoute extends Route {
  @service store;
  async model() {
    const folders = await this.store.findAll('folder');
    const problems = await this.store.findAll('problem');
    return hash({
      folders: folders.toArray(),
      problems,
    });
  }
}
