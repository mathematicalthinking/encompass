Encompass.WorkspacesNewRoute = Ember.Route.extend({

  model: function() {
    var store = this.get('store');
    var pdSets = store.findAll('PdSet');
    var folderSets = store.findAll('folderSet');

    return {pdSets: pdSets, folderSets: folderSets};
  },

  actions: {
    willTransition: function() {
      this.send('reload');
    }
  }
});
