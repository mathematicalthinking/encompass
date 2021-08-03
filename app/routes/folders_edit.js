import Route from '@ember/routing/route';

export default Route.extend({
  model: function (params, transition) {
    return this.store.find('folder', params.folder_id);
  },

  afterModel: function (model) {},

  renderTemplate: function () {
    this.render({
      into: 'application',
    });
  },
});
