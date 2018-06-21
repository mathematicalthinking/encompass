'use strict';

Encompass.SelectionsIndexRoute = Ember.Route.extend({

  model: function model() {
    var store = this.get('store');
    var objs = store.find('selection');
    return objs;
  }

});
//# sourceMappingURL=selections_index_route.js.map
