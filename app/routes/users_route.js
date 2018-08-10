/**
  * # Users Route
  * @description Route for dealing with all user objects
  * @todo This is really the users_index route and should be named as such by convention
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */
Encompass.UsersRoute = Ember.Route.extend({
  model: function () {
    return Ember.RSVP.hash({
      users: this.get('store').findAll('user'),
      organizations: this.get('store').findAll('organization'),
    });
  },

  renderTemplate: function(){
    this.render('users/users');
  }

});
