import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class MetricsFoldersRoute extends Route {
  @service store;
  model() {
    return hash({
      folders: this.store.findAll('folder'),
      problems: this.store.findAll('problem'),
    });
  }
}
