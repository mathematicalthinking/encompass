import Route from '@ember/routing/route';

export default class FolderRoute extends Route {
  model({ folder_id }) {
    return this.store.find('folder', folder_id);
  }

  // DECIDE IF THE BELOW IS NEEDED OR NEEDS REFACTORED

  renderTemplate() {
    this.render({
      into: 'application',
    });
  }
}
