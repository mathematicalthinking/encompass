Encompass.MetricsProblemController = Ember.Controller.extend({
  showProblemText: false,
  relevantWorkspaces: null,
  problemSubmissions: null,
  actions: {
    toggleProblemText: function(){
      this.toggleProperty('showProblemText');
    },
    findWorkspaces: function(){
      console.log('finding');
    },
    findSubmissions: function(){
      fetch(`/api/submissions`)
        .then(res=>res.json())
        .then(({submissions})=>{
          this.set('problemSubmissions', submissions.filter(s=>s.publication.puzzle.puzzleId === this.get('model.puzzleId')));
        });
    }
  }
});