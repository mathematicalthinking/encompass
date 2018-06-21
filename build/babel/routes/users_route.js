'use strict';

/**
  * # Users Route
  * @description Route for dealing with all user objects
  * @todo This is really the users_index route and should be named as such by convention
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */
Encompass.UsersRoute = Ember.Route.extend({

  model: function model() {
    var store = this.get('store');
    var users = store.findAll('user');
    return users;
  },

  renderTemplate: function renderTemplate() {
    this.render();
  }

});
//# sourceMappingURL=users_route.js.map
