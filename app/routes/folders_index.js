/**
 * # Folders Index Route
 * @description Route to view all folders
 * @since 1.0.0
 */
import Route from '@ember/routing/route';

export default class FoldersIndexRoute extends Route {
  model() {
    return this.store.findAll('folder');
  }

  afterModel(folders, transition) {
    if (folders.length === 1) {
      this.transitionTo('workspaceFolder', folders.firstObject);
    }
  }
}
