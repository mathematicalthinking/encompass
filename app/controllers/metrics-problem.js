Encompass.MetricsProblemController = Ember.Controller.extend({
  showProblemText: false,
  relevantWorkspaces: [],
  actions: {
    toggleProblemText: function(){
      this.toggleProperty('showProblemText');
    },
    findWorkspaces: function(){
      this.set('relevantWorkspaces', this.get('store').findAll('workspace').filterBy('firstSubmission.problem', this.model.id));
    }
  }
});