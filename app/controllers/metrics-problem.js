Encompass.MetricsProblemController = Ember.Controller.extend({
  showProblemText: false,
  relevantWorkspaces: null,
  actions: {
    toggleProblemText: function(){
      this.toggleProperty('showProblemText');
    },
    findWorkspaces: function(){
      let data = this.get('store').findAll('workspace').filterBy("firstSubmission.publication.puzzle.id", this.model.id);
      this.set('relevantWorkspaces', data);
    }
  }
});