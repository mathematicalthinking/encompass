import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';
export default class MetricsRoute extends Route {
  @service store;
  model() {
    return hash({
      workspaces: this.store.findAll('workspace'),
      problems: this.store.findAll('problem'),
      sections: this.store.findAll('section'),
      users: this.store.findAll('user'),
    });
  }
}
