Encompass.MetricsSubmissionController = Ember.Controller.extend({
  showSelections: false,
  showFolders: false,
  showComments: false,
  showResponses: false,
  ws: '',

  workspaceId: Ember.computed('model', function(){
    const [id] = this.get('model.workspaces').mapBy('id');
    return id;
  }),
  workspaceName: Ember.computed('model', function(){
    this.get('model.workspaces')
      .then((res)=>{
        let [name] = res.mapBy('name');
        this.set('ws', name);
    });
  }),
  actions: {
    handleToggle: function(prop){
      this.set('showSelections', false);
      this.set('showFolders', false);
      this.set('showComments', false);
      this.set('showResponses', false);
      this.set(prop, true);
    }
  }
});