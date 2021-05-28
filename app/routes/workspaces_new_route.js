Encompass.WorkspacesNewRoute = Encompass.AuthenticatedRoute.extend({
  //check if user is student, go home if true
  beforeModel: function() {
    this._super.apply(this, arguments);

    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.transitionTo('/');
    }
  },
  // gets all folderSets, sections, assignments, users, and problems immediately
  model: function() {
    return Ember.RSVP.hash({
      // pdSets: this.get('store').findAll('PdSet'),
      folderSets: this.get('store').findAll('folderSet'),
      sections: this.get('store').findAll('section'),
      assignments: this.get('store').findAll('assignment'),
      users: this.get('store').findAll('user'),
      problems: this.get('store').findAll('problem')
    });
  },

  actions: {
    // Created workspaceId and is passed from component to redirect
    toWorkspaces: function (workspaceId,) {
      this.transitionTo('workspace.work', workspaceId);
    },

    toWorkspace: function(id) {
      this.transitionTo('workspace/work', id);
    }
  }
});
