Encompass.Controller = Ember.Controller.extend({
  heading: null,
  content: null,
  showingSelections: false,
  actions: {
    setContent: function(name, data){
      this.set('heading', name);
      this.set('content', data);
      console.log(data);
    },
    showHighlights: function(){
      this.toggleProperty('showingSelections');
    }
  }
});