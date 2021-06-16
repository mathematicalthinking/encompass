Encompass.MetricsRoute = Ember.Route.extend({
  model(){
    return Ember.RSVP.hash({
      workspaces: this.get('store').findAll('workspace'),
      problems: this.get('store').findAll('problem')
    });
  },
});