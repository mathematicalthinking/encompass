/**
 * # Folders Index Route
 * @description Route to view all folders
 * @since 1.0.0
 */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class FoldersIndexRoute extends Route {
  @service router;
  model() {
    return this.store.findAll('folder');
  }

  afterModel(folders, transition) {
    if (folders.length === 1) {
      this.router.transitionTo('workspaceFolder', folders.firstObject);
    }
  }
}
