Encompass.ImportRoute = Encompass.AuthenticatedRoute.extend({
  model: function() {
    return Ember.RSVP.hash({
      problems: this.get('store').findAll('problem'),
      sections: this.get('store').findAll('section'),
      folderSets: this.get('store').findAll('folderSet'),
    });
  },
  actions: {
    toWorkspaces: function() {
      console.log('in toWorkspaces');
      this.transitionTo('workspaces');
    }
  },
  renderTemplate: function () {
    this.render('import/import');
  },

});
