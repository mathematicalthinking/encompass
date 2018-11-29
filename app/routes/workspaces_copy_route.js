Encompass.WorkspacesCopyRoute = Encompass.AuthenticatedRoute.extend({
  beforeModel: function (transition) {
    this._super.apply(this, arguments);

    let workspace = transition.queryParams.workspace;
    this.set('workspaceId', workspace);
    console.log('workspaceId', this.get('workspaceId'));

    //set on the route then return it on the model

  },

  model: function() {
    const store = this.get('store');
    this.set('workspaceToCopy', this.get('workspaceId'));
    return Ember.RSVP.hash({
      folderSets: store.findAll('folderSet'),
      workspacetoCopy: this.get('workspaceId'),
    });

  },
  actions: {
    toWorkspace(id) {
      this.transitionTo('workspace.work', id);
    }
  }
});