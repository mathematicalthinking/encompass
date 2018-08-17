Encompass.WorkspacesNewRoute = Ember.Route.extend({

  model: function() {
    return Ember.RSVP.hash({
      pdSets: this.get('store').findAll('PdSet'),
      folderSets: this.get('store').findAll('folderSet'),
      sections: this.get('store').findAll('section'),
      assignments: this.get('store').findAll('assignment'),
      users: this.get('store').findAll('user'),
      problems: this.get('store').findAll('problem')
    });
  },

  actions: {
    // willTransition: function() {
    //   this.send('reload');
    // }
    toWorkspaces: function() {
      console.log('in toWorkspaces wsroute');
      this.transitionTo('workspaces');
    }
  }
});
