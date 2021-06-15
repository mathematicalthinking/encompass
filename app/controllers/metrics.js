Encompass.Controller = Ember.Controller.extend({
  heading: null,
  content: null,
  actions: {
    setContent: function(name, data){
      this.set('heading', name);
      this.set('content', data);
      console.log(data);
    },
    showHighlights: function(){
      console.log("highlighting");
    }
  }
});