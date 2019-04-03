Encompass.VmtImportRoute = Encompass.AuthenticatedRoute.extend({
  controllerName: 'vmt-import',

  model() {
    return Ember.RSVP.hash({
      folderSets: this.get('store').findAll('folderSet'),
      users: this.get('store').findAll('user'),
    });
  },

  actions: {
    toWorkspaces: function(workspace) {
      window.location.href = `#/workspaces/${workspace._id}/submissions/${workspace.submissions[0]}`;
    }
  },

  renderTemplate() {
    this.render('vmt/import');
  }
});