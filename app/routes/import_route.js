Encompass.ImportRoute = Encompass.AuthenticatedRoute.extend(Encompass.ConfirmLeavingRoute, {
  controllerName: 'import',

  model: function() {
    return Ember.RSVP.hash({
      sections: this.get('store').findAll('section'),
      folderSets: this.get('store').findAll('folderSet'),
      users: this.get('store').findAll('user'),
      problems: this.get('store').findAll('problem')
    });
  },

  actions: {
    toWorkspaces: function(workspace) {
      window.location.href = `#/workspaces/${workspace._id}/submissions/${workspace.submissions[0]}`;
    }
  },

  renderTemplate: function () {
    this.render('import/import');
  },
});