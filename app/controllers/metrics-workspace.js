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
      const result = {};
      this.get("model.comments").mapBy('text').forEach(comment=>comment.replace(/[:\(\)",!\?\.]/gm, '').split(/\s/g).forEach((word)=>{
        if(result[word.toLowerCase()]){
          result[word.toLowerCase()]++;
        } else {
          result[word.toLowerCase()] = 1;
        }
      }));
      this.get("model.responses").mapBy('text').forEach(comment=>comment.replace(/[:\(\)",!\?\.]/gm, '').split(/\s/g).forEach((word)=>{
        if(result[word.toLowerCase()]){
          result[word.toLowerCase()]++;
        } else {
          result[word.toLowerCase()] = 1;
        }
      }));
      let array = Object.keys(result).map(key=>[key, result[key]]);
      console.log(array);
    }
  }
});