Encompass.MetricsRoute = Ember.Route.extend({
  model(){
    return this.get('store').findAll('workspace');
  },
});