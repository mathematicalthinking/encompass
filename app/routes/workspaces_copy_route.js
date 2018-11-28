Encompass.WorkspacesCopyRoute = Encompass.AuthenticatedRoute.extend({

  model: function() {
    const store = this.get('store');
    return Ember.RSVP.hash({
      folderSets: store.findAll('folderSet')
    });

  },
  actions: {
    toWorkspace(id) {
      this.transitionTo('workspace.work', id);
    }
  }
});