'use strict';

Encompass.FoldersEditRoute = Ember.Route.extend({

  model: function model(params, transition) {
    // jshint camelcase: false
    console.log('ID: ', params.folder_id);
    return this.store.find('folder', params.folder_id);
  },

  afterModel: function afterModel(model) {
    console.log('Folder: ', Ember.typeOf(model), model.get('name'));
  },

  renderTemplate: function renderTemplate() {
    this.render({
      into: 'application'
    });
  }
});
//# sourceMappingURL=folders_edit_route.js.map
