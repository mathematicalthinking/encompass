/**
  * # Users Route
  * @description Route for dealing with all user objects
  * @todo This is really the users_index route and should be named as such by convention
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */
Encompass.UsersRoute = Ember.Route.extend({
  beforeModel: function() {
    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.transitionTo('/');
    }
  },
  model: function () {
    return Ember.RSVP.hash({
      users: this.get('store').findAll('user'),
      organizations: this.get('store').findAll('organization'),
    });
  },

});
