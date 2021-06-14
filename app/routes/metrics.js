Encompass.MetricsRoute = Ember.Route.extend({
  model(){
    console.log("metrics route");
    return this.get('store').findAll('workspace');
  },
  content: null,
  actions: {
    setContent(data){
      this.content = data;
    }
  }
});