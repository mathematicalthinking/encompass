Encompass.FoldersEditRoute = Ember.Route.extend({

  model: function(params, transition) {
    // jshint camelcase: false
    console.log('ID: ', params.folder_id);
    return this.store.find('folder', params.folder_id);
  },

  afterModel: function(model) {
    console.log('Folder: ', Ember.typeOf(model), model.get('name'));
  },

  renderTemplate: function() {
    this.render({
      into: 'application',
    });
  }
});
