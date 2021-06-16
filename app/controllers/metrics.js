Encompass.Controller = Ember.Controller.extend({
  heading: null,
  content: null,
  showingSelections: false,
  showProblemText: false,
  actions: {
    setContent: function(name, data){
      this.set('heading', name);
      this.set('content', data);
      console.log(data);
    },
    showHighlights: function(){
      this.toggleProperty('showingSelections');
    },
    toggleProblemText: function(){
      this.toggleProperty('showProblemText');
    }
  }
});