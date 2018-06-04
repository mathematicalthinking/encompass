/**
  * # Users Controller
  * @description Controller for managing users.
  * @authors Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.2
*/
Encompass.UsersController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  currentUser: Encompass.currentUser
});
