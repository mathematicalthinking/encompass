Encompass.MetricsWorkspaceController = Ember.Controller.extend({
  heading: null,
  content: null,
  wordMap: {},
  actions: {
    setContent: function(name, data){
      this.set('heading', name);
      this.set('content', data);
    },
    generateWordMap: function(){
      const comments = this.get("model.comments").mapBy('text').map(comment=>comment.split(' '));
      console.log(comments);
    }
  }
});