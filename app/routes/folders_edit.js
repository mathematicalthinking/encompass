import Route from '@ember/routing/route';

export default class FolderRoute extends Route {
  model(params, transition) {
    return this.store.find('folder', params.folder_id);
  }

  afterModel(model) {
    // Your implementation here
  }

  renderTemplate() {
    this.render({
      into: 'application',
    });
  }
}
