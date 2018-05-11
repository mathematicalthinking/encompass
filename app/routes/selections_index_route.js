Encompass.SelectionsIndexRoute = Ember.Route.extend({

  model: function() {
    var store = this.get('store');
    var objs = store.find('selection');
    return objs;
  }

});
