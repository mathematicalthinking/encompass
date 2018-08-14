Encompass.WorkspacesNewRoute = Ember.Route.extend({

  model: function() {
    return Ember.RSVP.hash({
      pdSets: this.get('store').findAll('PdSet'),
      folderSets: this.get('store').findAll('folderSet'),
      sections: this.get('store').findAll('section'),
      assignments: this.get('store').findAll('assignment')
    });
  },

  actions: {
    // willTransition: function() {
    //   this.send('reload');
    // }
  }
});
