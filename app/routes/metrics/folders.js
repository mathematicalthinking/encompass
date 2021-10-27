import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MetricsFoldersRoute extends Route {
  @service store;
  async model() {
    const folders = await this.store.findAll('folder');
    return folders.toArray();
  }
}
