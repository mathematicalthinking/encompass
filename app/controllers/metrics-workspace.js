Encompass.MetricsWorkspaceController = Ember.Controller.extend({
  heading: null,
  content: null,
  list: [],
  actions: {
    setContent: function(name, data){
      this.set('heading', name);
      this.set('content', data);
    },
    generateWordMap: function(){
      const ignore = ['the', 'and', 'of', 'in', 'on', 'into', 'to', 'a', 'is', 'that', 'you', 'i', 'was', 'would', 'at', 'your', 'my', 'for', 'but', 'it', 'if', 'or', '', 'this', 'what', 'she', 'he', 'off', 'be', 'is', 'are', 'was', 'have', 'can', 'did', 'we', 'me', 'our', 'very', 'which', 'had', 'not', 'do'];
      const result = {};
      this.get("model.comments").mapBy('text').forEach(comment=>comment.replace(/[:\(\)",!\?\.]/gm, '').split(/\s/g).forEach((word)=>{
        if(result[word.toLowerCase()] && !ignore.includes(word.toLowerCase())){
          result[word.toLowerCase()]++;
        } else if(!ignore.includes(word.toLowerCase())) {
          result[word.toLowerCase()] = 1;
        }
      }));
      this.get("model.responses").mapBy('text').forEach(comment=>comment.replace(/[:\(\)",!\?\.]/gm, '').split(/\s/g).forEach((word)=>{
        if(result[word.toLowerCase()] && !ignore.includes(word.toLowerCase())){
          result[word.toLowerCase()]++;
        } else if(!ignore.includes(word.toLowerCase())) {
          result[word.toLowerCase()] = 1;
        }
      }));
      this.set('list', Object.keys(result).map(key=>[key, result[key]]));
    }
  }
});