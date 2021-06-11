Encompass.MetricsRoute = Ember.Route.extend({
  model(){
    console.log("metrics route");
    return this.get('store').findAll('workspace');
  },
});