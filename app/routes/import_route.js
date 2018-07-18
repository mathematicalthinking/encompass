Encompass.ImportRoute = Encompass.AuthenticatedRoute.extend({
  model: function() {
    return Ember.RSVP.hash({
      problems: this.get('store').findAll('problem'),
      sections: this.get('store').findAll('section')
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
